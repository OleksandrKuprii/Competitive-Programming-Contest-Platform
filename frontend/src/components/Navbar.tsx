import * as React from 'react';
import { Button, Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';


const _Navbar = () => {
    const { t } = useTranslation();

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="h5">
            <Container>
                <Nav className="mr-auto">
                    <Row>
                        <Col>
                            <Nav.Link href="#/" style={{ fontWeight: 'bold', paddingLeft: 50, paddingRight: 50 }}>{t('brandname')}</Nav.Link>
                        </Col>
                        <Col>
                            <Nav.Link href="#tournaments/">{t('pagenames:tournaments')}</Nav.Link>
                        </Col>
                        <Col>
                            <Nav.Link href="#tasks/">{t('pagenames:tasks')}</Nav.Link>
                        </Col>
                    </Row>
                </Nav>

                <Button variant="secondary">Sign in</Button>
            </Container>
        </Navbar>)
}

export default _Navbar;