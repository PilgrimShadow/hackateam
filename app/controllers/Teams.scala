package controllers

// Standard Library
import javax.inject.Inject

import akka.actor.Status.Success
import constructs.{CumulativeGoal, Point, Team, TodoItem}
import reactivemongo.bson.BSONObjectID

import scala.concurrent.Future

// Project
import constructs.ResultInfo
import forms._

// Play Framework
import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits.defaultContext

// Reactive Mongo
import play.modules.reactivemongo.{MongoController, ReactiveMongoApi, ReactiveMongoComponents}


/**
  * Controller to manage the study sessions API.
  *
  * @param reactiveMongoApi Holds a reference to the database.
  */
class Teams @Inject()(val reactiveMongoApi: ReactiveMongoApi)
  extends Controller with MongoController with ReactiveMongoComponents {

  protected val todo = new models.Teams(reactiveMongoApi)

  /**
    * Add a todo item for a username
    *
    * @return
    */
  def addTeam = Action.async { implicit request =>

    withUsername(username => {

      AddTeamForm.form.bindFromRequest()(request).fold(
        _ => invalidFormResponse,
        form => {

          val t = Team(form.name, form.hackathon, form.description, System.currentTimeMillis(), Vector(username), Vector[String]())

          todo.addTeam(t).map(result => Ok(result.toJson))
        }
      )
    })
  }

  /**
    * Delete a todo item for a username
    *
    * @return
    */
  def deleteTeam = Action.async { implicit request =>

    withUsername(username => {

      DeleteTodoItemForm.form.bindFromRequest()(request).fold(
        _ => invalidFormResponse,
        form => {

          BSONObjectID.parse(form.id).toOption.fold(
            Future(Ok(ResultInfo.failWithMessage("invalid object id").toJson))
          )(oid => todo.deleteTodoItem(username, oid).map(result => Ok(result.toJson)))
        }
      )
    })
  }

  /**
    * Complete a todo item for a username
    *
    * @return
    */
  def completeTodoItem = Action.async { implicit request =>

    withUsername(username => {

      CompleteTodoItemForm.form.bindFromRequest()(request).fold(
        _ => invalidFormResponse,
        form => {

          todo.completeTodoItem(username, form.id, Point(form.longitude, form.latitude)).map(
            result => Ok(result.toJson)
          )
        }
      )

    })
  }

  /**
    * Get all todo items for a username
    *
    * @return
    */
  def getTeams = Action.async { implicit request =>

    withUsername(_ =>
      todo.getTeams().map(resInfo => Ok(resInfo.toJson))
    )
  }

  /**
    * Get all teams containing the user
    *
    * @return
    */
  def getTeamsForUsername = Action.async { implicit request =>

    withUsername(username => {
      todo.getTeams(username).map(resInfo => Ok(resInfo.toJson))
    })
  }
}