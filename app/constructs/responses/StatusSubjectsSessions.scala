package constructs.responses

import constructs.{Projector, Session, Status, Skill}
import play.api.libs.json.Json
import reactivemongo.bson.BSONDocument

/**
  * Used when a user's status, subject vector, and session vector are needed.
  *
  * @param username The username.
  * @param status   The study status of the user.
  * @param skills The subject vector for the user.
  * @param sessions The session list for the user.
  */
case class StatusSubjectsSessions(username: String, status: Status, skills: Vector[Skill], sessions: Vector[Session])


object StatusSubjectsSessions {

  import reactivemongo.bson.Macros

  // Implicitly convert to/from BSON
  implicit val handler = Macros.handler[StatusSubjectsSessions]

  // Implicitly convert to JSON
  implicit val writer = Json.writes[StatusSubjectsSessions]


  implicit val projector = new Projector[StatusSubjectsSessions] {
    val projector = BSONDocument("username" -> 1, "status" -> 1, "skills" -> 1, "sessions" -> 1, "_id" -> 0)
  }
}
