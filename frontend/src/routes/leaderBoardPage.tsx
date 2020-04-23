import React, { ReactNode } from 'react';

import { Container, Row, Col } from 'react-bootstrap';
import ActivityStatistics from '../components/leaderboard/activityStatistics';
import CustomTable from '../components/CustomTable';

const data = [
  {
    date: 'april',
    visitors: 4000,
    solved: 2400,
  },
  {
    date: 'may',
    visitors: 3000,
    solved: 1398,
  },
  {
    date: 'july',
    visitors: 12000,
    solved: 9800,
  },
  {
    date: 'juny',
    visitors: 4780,
    solved: 3908,
  },
  {
    date: 'augustay',
    visitors: 5890,
    solved: 4800,
  },
  {
    date: 'septomber',
    visitors: 2390,
    solved: 3800,
  },
  {
    date: 'oktyabrь',
    visitors: 3490,
    solved: 4300,
  },
];

export type CustomTableRowIdentifier = number | string;
export type CustomTableRow = {
  id: CustomTableRowIdentifier;
  row: ReactNode;
};

export interface Leaders {
  id: number;
  place: number;
  nick: string;
  rating: string;
}

const LeaderBoardPage = ({
  leadersFastest,
  leadersBest,
  leadersAccurate,
}: {
  leadersFastest: Leaders[];
  leadersBest: Leaders[];
  leadersAccurate: Leaders[];
}) => {
  const rowsf = leadersFastest.map(
    ({ id, place, nick, rating }) =>
      ({
        id,
        row: (
          <>
            <td>{place}</td>
            <td>{nick}</td>
            <td>{rating}</td>
          </>
        ),
      } as CustomTableRow),
  );
  const rowsb = leadersBest.map(
    ({ id, place, nick, rating }) =>
      ({
        id,
        row: (
          <>
            <td>{place}</td>
            <td>{nick}</td>
            <td>{rating}</td>
          </>
        ),
      } as CustomTableRow),
  );
  const rowsa = leadersAccurate.map(
    ({ id, place, nick, rating }) =>
      ({
        id,
        row: (
          <>
            <td>{place}</td>
            <td>{nick}</td>
            <td>{rating}</td>
          </>
        ),
      } as CustomTableRow),
  );
  return (
    <Container>
      <Row>
        <Col>
          <CustomTable
            tableName="the fastest hand in the west"
            headers={['Place', 'nick', 'numsolved']}
            rows={rowsf}
          />
        </Col>
        <Col>
          <CustomTable
            tableName="The accurate man"
            headers={['id', 'nick', 'rating']}
            rows={rowsa}
          />
        </Col>
        <Col>
          <CustomTable
            tableName="the best of the best"
            headers={['id', 'nick', 'acc']}
            rows={rowsb}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <ActivityStatistics data={data} />
        </Col>
      </Row>
    </Container>
  );
};

export default LeaderBoardPage;
