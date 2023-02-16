import AvatarIcon from 'public/other/avatar.svg';
import ModalWrapper from '@components/ModalWrapper';
import ModalTitle from '@shared/ModalTitle';
import ModalContentWrapper from '@components/ModalContentWrapper';
import ModalSubtitle from '@shared/ModalSubtitle';
import OTPInput from '@components/OTPInput';
import Button from '@shared/Button';
import UserNameLabel from '@components/UserNameLabel/';
import { IUser } from 'src/common/models/user';
import styles from './OTPBlock.module.scss';
import btnStyles from '@shared/Button/Button.module.scss';
import classNames from 'classnames';

interface IOTPBlockProps {
  error: string;
  otpHandler: (otp: string) => void;
  btnClickHandler: () => void;
  blockTitle?: string;
  user?: IUser;
}

export default function OTPBlock({
  user,
  error,
  otpHandler,
  btnClickHandler,
}: IOTPBlockProps) {
  return (
    <>
      <ModalWrapper className={styles.wrapper}>
        <div className={styles.avatar}>
          <AvatarIcon className={styles.icon} />
        </div>
        <ModalTitle
          className={styles['heading-2fa']}
          text={user?.profile?.displayName || user?.email}
        />
        <UserNameLabel>
          {user?.username ? `@${user?.username}` : ''}
        </UserNameLabel>
        <ModalContentWrapper>
          <ModalSubtitle
            className={styles.subTitle}
            text='Please enter 6-digit code from the Google Authenticator app and clicks Confirm.'
          />
          <OTPInput
            length={6}
            autoFocus
            onChangeOTP={otpHandler}
            error={error}
          />
          <Button
            size='l'
            color={'blue'}
            fillStyle={false}
            fullWidth={false}
            onClick={btnClickHandler}
            className={classNames(
              styles.button,
              btnStyles['btn-login-primary']
            )}
          >
            Confirm
          </Button>
        </ModalContentWrapper>
      </ModalWrapper>
    </>
  );
}
