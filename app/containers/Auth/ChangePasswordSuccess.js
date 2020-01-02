import React, { PureComponent } from 'react';
import ChangePasswordSuccessForm from 'components/Auth/ChangePasswordSuccessForm';
import Bg from 'assets/img/forgot-bg.jpg';
import Reviewer from 'assets/img/faces/oval.jpg';
import AuthLayout from 'components/Auth/AuthLayout';

class ChangePasswordSuccess extends PureComponent {
  render() {
    return (
      <AuthLayout
        bg={Bg}
        review={{
          text: 'The road to success is littered with potholes.Try to enjoy the bumpy ride!',
          avatar: Reviewer,
          name: 'Harry Holder',
          username: '@harryholder'
        }}
      >
        <ChangePasswordSuccessForm onSubmit={this.onSubmit} />
      </AuthLayout>
    );
  }
}

export default ChangePasswordSuccess;
