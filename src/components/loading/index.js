import React, { Fragment } from "react";

import { Row, Col, Card, CardBody, Container } from "reactstrap";

const Spinners = (props) => {
  return (
    <Fragment>
      <Container fluid={true}>
        <Row>
          <Col sn="3">
            <Card>
              <CardBody className="row">
                <Col md="3">
                  <div className="loader-box">
                    <div className="loader-17"></div>&nbsp;
                    {props.msg}
                  </div>
                </Col>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Spinners;
