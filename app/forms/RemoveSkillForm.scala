package forms

import play.api.data.Form
import play.api.data.Forms._


case class RemoveSkillForm(subject: String)

object RemoveSkillForm {

  val form: Form[RemoveSkillForm] = Form(
    mapping(
      "subject" -> nonEmptyText
    )(RemoveSkillForm.apply)(RemoveSkillForm.unapply)
  )
}
