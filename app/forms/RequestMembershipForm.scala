package forms

import play.api.data.Form
import play.api.data.Forms._

case class RequestMembershipForm(teamname: String)

object RequestMembershipForm {

  val form: Form[RequestMembershipForm] = Form(
    mapping(
      "teamname" -> nonEmptyText
    )(RequestMembershipForm.apply)(RequestMembershipForm.unapply)
  )


}
