package forms

import play.api.data.Form
import play.api.data.Forms._


case class AddSkillForm(name: String, description: String)

object AddSkillForm {

  val form: Form[AddSkillForm] = Form(
    mapping(
      "name" -> nonEmptyText,
      "description" -> nonEmptyText
    )(AddSkillForm.apply)(AddSkillForm.unapply)
  )
}
