package forms

import play.api.data.Form
import play.api.data.Forms._

case class AcceptMemberForm(waiter: String, teamname: String)

object AcceptMemberForm {

  val form: Form[AcceptMemberForm] = Form(
    mapping(
      "waiter" -> nonEmptyText,
      "teamname" -> nonEmptyText
    )(AcceptMemberForm.apply)(AcceptMemberForm.unapply)
  )

}
