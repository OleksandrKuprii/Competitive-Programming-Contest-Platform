import * as React from 'react';
import { FC } from 'react';

import { Title, Subtitle, TextAlign } from '@/atoms/typography';
import Input from '@/atoms/input';
import { Row, Col, Grid, JustifyContent } from '@/atoms/grid';
import Button from '@/atoms/button';

import { IoIosArrowDropright } from 'react-icons/all';

const RegisterPage: FC = () => {
  return (
    <>

      <Title align={TextAlign.Center}>
        Finish registration
      </Title>


      <Row justifyContent={JustifyContent.Center}>
        <Col>
          <Input placeholder="Username" />
          
          <br/>


          <Input placeholder="Fullname" />

          <Grid justifyContent={JustifyContent.Center}>
            <Button>
              Continue
            </Button>
          </Grid>
        </Col>
      </Row>
    </>
  );
};

export default RegisterPage;
