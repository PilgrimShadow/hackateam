package forms

import play.api.data.Form
import play.api.data.Forms._


case class RenameSkillForm(oldName: String, newName: String)

object RenameSkillForm {

  val form: Form[RenameSkillForm] = Form(
    mapping(
      "oldName" -> nonEmptyText,
      "newName" -> nonEmptyText
    )(RenameSkillForm.apply)(RenameSkillForm.unapply)
  )
}
