package forms

import play.api.data.Form
import play.api.data.Forms._

case class UpdateAboutForm(text: String)

object UpdateAboutForm {
  val form: Form[UpdateAboutForm] = Form(
    mapping(
      "text" -> text
    )(UpdateAboutForm.apply)(UpdateAboutForm.unapply)
  )
}