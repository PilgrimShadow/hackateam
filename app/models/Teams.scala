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
import constructs.{ResultInfo, Team, Skill}
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
    * Add a new team to the system
    *
    * @param team The team to add
    * @return
    */
  def addTeam(team: Team): Future[ResultInfo[String]] = {

    teamBSON.flatMap(_.insert(team)).map(
      result =>
        if (result.ok) ResultInfo.succeedWithMessage("added item to list")
        else ResultInfo.failWithMessage("failed to add item")
    )
  }

  /**
    * Add a skill to the given team
    *
    * @param username The user adding the skill
    * @param teamName The team name
    * @param skill The skill to add
    * @return
    */
  def addSkill(username: String, teamName: String, skill: Skill): Future[ResultInfo[String]] = {

    val s = BSONDocument(
      "name" -> teamName,
      "members" -> username
    )

    val u = BSONDocument(
      "$push" -> BSONDocument(
        "skills" -> skill
      )
    )

    teamBSON.flatMap(_.update(s, u)).map(
      result =>
        if (result.ok) ResultInfo.succeedWithMessage("added skill")
        else ResultInfo.failWithMessage("failed to add skill")
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
  def getUnjoinedTeams(username: String): Future[ResultInfo[List[JsObject]]] = {

    val s = JsObject(Map(
      "members" -> JsObject(Map("$ne" -> JsString(username)))
    ))

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
