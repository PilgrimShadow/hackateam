package constructs

import play.api.libs.json.Json
import reactivemongo.bson.BSONDocument

case class Team(name: String, hackathon: String, description: String, repoLink: String, formed: Long,
                members: Vector[String], waiting: Vector[String], skills: Vector[Skill], messages: Vector[TeamMessage])

object Team {

  import reactivemongo.bson.Macros

  // Implicitly convert to/from BSON
  implicit val teamHandler = Macros.handler[Team]

  // Implicitly convert to JSON
  implicit val teamWrites = Json.writes[Team]

  // A MongoDB projector to get only the fields for this class
  val projector = BSONDocument("_id" -> 0)

}
