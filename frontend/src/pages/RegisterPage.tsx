import * as React from 'react';
import { FC, RefObject, useCallback, useRef, useState } from 'react';
import { Paragraph, Title } from '@/atoms/typography';
import { Col, Row } from '@/atoms/grid';
import { Spacer } from '@/atoms/spacers';
import InputWithHeader from '@/molecules/inputWithHeader';
import Button from '@/atoms/button';
import ColoredBox from '@/atoms/box/ColoredBox';
import TextArea from '@/atoms/textArea';

const RegisterPage: FC = () => {
  const usernameRef = useRef(null) as RefObject<HTMLInputElement>;
  const fullnameRef = useRef(null) as RefObject<HTMLInputElement>;

  const [showMessage, setShowMessage] = useState(false);

  const onSave = useCallback(() => {
    const username = usernameRef.current?.value;
    const fullname = fullnameRef.current?.value;

    const valid = !(!username || !fullname);

    setShowMessage(!valid);
  }, [usernameRef, fullnameRef]);

  return (
    <>
      <Spacer />
      <Row>
        <Col style={{ width: '200px' }}>
          <Title>Complete the registration</Title>
          <Paragraph>a few steps to get started</Paragraph>
        </Col>
        <Col>
          <Spacer size={20} />

          <Row justifyContent="space-between">
            <InputWithHeader
              header="Username"
              inputRef={usernameRef}
              required
            />

            <Spacer size={20} />

            <InputWithHeader
              header="Fullname"
              inputRef={fullnameRef}
              required
            />
          </Row>

          <Spacer size={10} />

          <Row justifyContent="space-between">
            <InputWithHeader header="Birthday" inputRef={usernameRef} />

            <Spacer size={20} />

            <InputWithHeader header="Country" inputRef={fullnameRef} />
          </Row>

          <Spacer size={10} />

          <Row justifyContent="space-between">
            <InputWithHeader header="City" inputRef={usernameRef} />

            <Spacer size={20} />

            <InputWithHeader
              header="School/University"
              inputRef={fullnameRef}
            />
          </Row>

          <Spacer size={10} />

          <Row justifyContent="center">
            <Col>
              <Paragraph bold style={{ paddingBottom: '10px' }}>
                Bio
              </Paragraph>

              <TextArea style={{ height: 200 }} />
            </Col>
          </Row>

          {showMessage && (
            <>
              <Spacer size={20} />
              <ColoredBox variant="danger" padding={10}>
                Please fill all required fields
              </ColoredBox>
            </>
          )}

          <Spacer size={20} />

          <Button padding="10px 40px" onClick={onSave}>
            Save
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default RegisterPage;
