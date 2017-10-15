package controllers

// Standard Library
import javax.inject.Inject

import constructs._
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

  protected val teams = new models.Teams(reactiveMongoApi)

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

          val t = Team(form.name, form.hackathon, form.description, form.repoLink, System.currentTimeMillis(),
            Vector(username), Vector(), Vector[Skill]())

          teams.addTeam(t).map(result => Ok(result.toJson))
        }
      )
    })
  }

  /**
    * Add a user to a team
    *
    * @return
    */
  def addUserToTeam = Action.async { implicit request =>

    withUsername(username => {

      JoinTeamForm.form.bindFromRequest()(request).fold(
        _ => invalidFormResponse,
        goodForm => {

          teams.addUserToTeam(username, goodForm.teamname).map(resInfo => Ok(resInfo.toJson))
        }
      )

    })
  }

  /**
    * Request membership in a team
    *
    * @return
    */
  def requestMembership = Action.async { implicit request =>

    withUsername(username => {

      RequestMembershipForm.form.bindFromRequest()(request).fold(
        _ => invalidFormResponse,
        goodForm => {
          teams.requestMembership(username, goodForm.teamname).map(resInfo => Ok(resInfo.toJson))
        }
      )
    })
  }

  /**
    *
    * @return
    */
  def acceptMembership = Action.async { implicit request =>

    withUsername(username => {

      AcceptMemberForm.form.bindFromRequest()(request).fold(
        _ => invalidFormResponse,
        goodForm => {
          teams.acceptMember(username, goodForm.waiter, goodForm.teamname).map(resInfo => Ok(resInfo.toJson))
        }
      )
    })
  }

  /**
    * Add a team skill
    *
    * @return
    */
  def addSkill = Action.async { implicit request =>

    withUsername(username => {

      AddTeamSkillForm.form.bindFromRequest()(request).fold(
        _ => invalidFormResponse,
        goodForm => {

          val s = Skill(goodForm.skillName, System.currentTimeMillis(), "")

          teams.addSkill(username, goodForm.teamName, s).map(resInfo => Ok(resInfo.toJson))
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
          )(oid => teams.deleteTodoItem(username, oid).map(result => Ok(result.toJson)))
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

          teams.completeTodoItem(username, form.id, Point(form.longitude, form.latitude)).map(
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
  def getUnjoinedTeams = Action.async { implicit request =>

    withUsername(username =>
      teams.getUnjoinedTeams(username).map(resInfo => Ok(resInfo.toJson))
    )
  }

  /**
    * Get all teams containing the user
    *
    * @return
    */
  def getTeamsForUsername = Action.async { implicit request =>

    withUsername(username => {
      teams.getTeams(username).map(resInfo => Ok(resInfo.toJson))
    })
  }
}
