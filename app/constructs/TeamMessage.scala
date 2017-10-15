package constructs

// Reactive Mongo
import play.api.libs.json.Json
import reactivemongo.bson.BSONDocument


/**
  * Represents a journal entry
  *
  * @param username  The username responsible for the journal entry
  * @param text      The content of the journal entry
  * @param timestamp The time at which the journal entry was recorded
  */
case class TeamMessage(username: String, text: String, timestamp: Long)

object TeamMessage {

  // Implicitly convert to JSON
  implicit val journalEntryWrites = Json.writes[TeamMessage]

  import reactivemongo.bson.Macros

  // Implicitly convert to/from BSON
  implicit val BSONHandler = Macros.handler[TeamMessage]

  // A MongoDB projector to get only the fields for this class
  val projector = BSONDocument(
    "username" -> 1, "text" -> 1, "timestamp" -> 1, "_id" -> 0
  )
}