package forms

import play.api.data.Form
import play.api.data.Forms._

case class JoinTeamForm(teamname: String)

object JoinTeamForm {
  val form: Form[JoinTeamForm] = Form(
    mapping(
      "teamname" -> nonEmptyText
    )(JoinTeamForm.apply)(JoinTeamForm.unapply)
  )
}
