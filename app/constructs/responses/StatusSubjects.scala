package constructs.responses

import constructs.{Projector, Status, Skill}
import play.api.libs.json.Json
import reactivemongo.bson.BSONDocument

/**
  * Used when both the user's status and subject list are needed.
  *
  * @param username The user's username.
  * @param status   The status of the user.
  * @param skills The valid subjects for the user
  */
case class StatusSubjects(username: String, status: Status, skills: Vector[Skill])


object StatusSubjects {

  import reactivemongo.bson.Macros

  // Implicitly convert to/from BSON
  implicit val handler = Macros.handler[StatusSubjects]

  // Implicitly convert to JSON
  implicit val writer = Json.writes[StatusSubjects]

  implicit val projector = new Projector[StatusSubjects] {
    val projector = BSONDocument("username" -> 1, "status" -> 1, "skills" -> 1, "_id" -> 0)
  }
}