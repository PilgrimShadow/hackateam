package models

// Standard Library
import constructs.Point
import play.api.libs.json._
import reactivemongo.bson.{BSONDocument, BSONObjectID}
import reactivemongo.play.json.collection.JSONCollection

import scala.concurrent.Future

// Play Framework
import play.api.libs.concurrent.Execution.Implicits.defaultContext

// Reactive Mongo
import play.modules.reactivemongo.ReactiveMongoApi
import play.modules.reactivemongo.json._
import reactivemongo.api.collections.bson.BSONCollection

// Project
import constructs.{ResultInfo, Team}
import helpers.Selectors.usernameAndID

/**
  * Model layer to manage to-do lists
  *
  * @param mongoApi
  */
class Teams(protected val mongoApi: ReactiveMongoApi) {

  protected def teamBSON: Future[BSONCollection] = mongoApi.database.map(_.collection("teams"))

  protected def teamJSON: Future[JSONCollection] = mongoApi.database.map(_.collection("teams"))

  /**
    *
    * @param item
    * @return
    */
  def addTeam(item: Team): Future[ResultInfo[String]] = {

    teamBSON.flatMap(_.insert(item)).map(
      result =>
        if (result.ok) ResultInfo.succeedWithMessage("added item to list")
        else ResultInfo.failWithMessage("failed to add item")
    )
  }

  /**
    *
    * @param username
    * @param id
    * @return
    */
  def deleteTodoItem(username: String, id: BSONObjectID): Future[ResultInfo[String]] = {

    teamBSON.flatMap(_.remove(usernameAndID(username, id), firstMatchOnly = true)).map(
      result =>
        if (result.ok) ResultInfo.succeedWithMessage("removed item from list")
        else ResultInfo.failWithMessage("failed to delete item")
    )
  }


  /**
    * Mark a todo item as completed
    *
    * @param username The username
    * @param id
    * @return
    */
  def completeTodoItem(username: String, id: String, coords: Point): Future[ResultInfo[String]] = {

    val s = BSONDocument(
      "username" -> username,
      "_id" -> BSONObjectID(id)
    )

    val u = BSONDocument(
      "$currentDate" -> BSONDocument(
        "endTime" -> true
      ),
      "$set" -> BSONDocument(
        "endPos" -> coords
      )
    )

    teamBSON.flatMap(_.update(s, u)).map(result =>
      if (result.ok) ResultInfo.succeedWithMessage(s"completed item: ${result.n}")
      else ResultInfo.failWithMessage("failed to add item")
    )
  }

  /**
    * Get all teams
    *
    * @return
    */
  def getTeams(): Future[ResultInfo[List[JsObject]]] = {

    val s = JsObject(Map[String, JsValue]())

    teamJSON.flatMap(
      _.find(s).cursor[JsObject]().collect[List]().map(
        teamList => ResultInfo.success("Retrieved teams", teamList)
      )
    )
  }

  /**
    * Get all teams containing the user
    *
    * @param username
    * @return
    */
  def getTeams(username: String): Future[ResultInfo[List[JsObject]]] = {

    val s = JsObject(Map[String, JsValue]("members" -> JsString(username)))

    teamJSON.flatMap(
      _.find(s).cursor[JsObject]().collect[List]().map(
        teamList => ResultInfo.success("Retrieved teams", teamList)
      )
    )
  }

}
