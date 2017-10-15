package forms

import play.api.data.Form
import play.api.data.Forms._

case class AddTeamSkillForm(teamName: String, skillName: String)

object AddTeamSkillForm {
  val form: Form[AddTeamSkillForm] = Form(
    mapping(
      "teamName" -> nonEmptyText,
      "skillName" -> nonEmptyText
    )(AddTeamSkillForm.apply)(AddTeamSkillForm.unapply)
  )
}
