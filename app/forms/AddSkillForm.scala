package forms

import play.api.data.Form
import play.api.data.Forms._


case class AddSkillForm(subject: String, description: String)

object AddSkillForm {

  val form: Form[AddSkillForm] = Form(
    mapping(
      "subject" -> nonEmptyText,
      "description" -> nonEmptyText
    )(AddSkillForm.apply)(AddSkillForm.unapply)
  )
}
