package forms

import play.api.data.Form
import play.api.data.Forms._

case class AddTeamMessageForm(teamname: String, text: String)


object AddTeamMessageForm {
  val form: Form[AddTeamMessageForm] = Form(
    mapping(
      "teamname" -> nonEmptyText,
      "text" -> nonEmptyText
    )(AddTeamMessageForm.apply)(AddTeamMessageForm.unapply)
  )
}