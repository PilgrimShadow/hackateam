package constructs

import play.api.libs.json.Json


case class ContactInfo(firstName: String, lastName: String, middleName: String, email: String,
                       phone: String, profiles: Profiles)

object ContactInfo {

  import reactivemongo.bson.Macros

  // Implicitly convert to JSON
  implicit val contactInfoWrites = Json.writes[ContactInfo]

  /**
    * Create a ContactInfo object with only an email
    *
    * @param email
    * @return
    */
  def onlyEmail(email: String) = ContactInfo("", "", "", email, "", Profiles.emptyProfiles)

  /**
    *
    * @param firstName
    * @param lastName
    * @param email
    * @return
    */
  def basics(firstName: String, lastName: String, email: String) = ContactInfo(firstName, lastName, "", email, "", Profiles.emptyProfiles)

  // Implicitly convert to/from BSON
  implicit val ContactInfoHandler = Macros.handler[ContactInfo]
}
