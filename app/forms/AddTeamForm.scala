package forms

import play.api.data.Form
import play.api.data.Forms._

case class AddTeamForm(name: String, hackathon: String, description: String)

object AddTeamForm {
  val form: Form[AddTeamForm] = Form(
    mapping(
      "name" -> nonEmptyText,
      "hackathon" -> nonEmptyText,
      "description" -> nonEmptyText
    )(AddTeamForm.apply)(AddTeamForm.unapply)
  )
}
