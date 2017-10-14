package constructs

import play.api.libs.json.Json


/**
  * Represents a subject that can be studied.
  *
  * @param name        The name of the skill.
  * @param added       The time when the skill was added.
  * @param description A description of this skill.
  */
case class Skill(name: String, added: Long, description: String)

object Skill {

  import reactivemongo.bson.Macros

  // Implicitly convert to/from BSON
  implicit val SkillHandler = Macros.handler[Skill]

  // Implicitly convert to JSON
  implicit val SkillWrites = Json.writes[Skill]
}