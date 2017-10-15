package forms

import play.api.data.Form
import play.api.data.Forms._

case class AddTeamForm(name: String, hackathon: String, description: String, repoLink: String)

object AddTeamForm {
  val form: Form[AddTeamForm] = Form(
    mapping(
      "name" -> nonEmptyText,
      "hackathon" -> nonEmptyText,
      "description" -> nonEmptyText,
      "repoLink" -> nonEmptyText
    )(AddTeamForm.apply)(AddTeamForm.unapply)
  )
}
