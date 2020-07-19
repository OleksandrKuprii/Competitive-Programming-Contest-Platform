import * as React from 'react';
import {FC} from "react";
import {useParams} from 'react-router-dom';
import {useStoreState} from "~/hooks/store";
import {FontWeight, Text, Title} from "@/toucanui/atoms/typography";
import Spacer from "@/toucanui/atoms/spacer";
import {Padding} from "~/mixins/padding";
import Result from "@/atoms/result";
import PrettyDate from "@/toucanui/atoms/prettyDate";

const SubmissionHeading: FC = () => {
  const {id: idStr} = useParams();

  const id = parseInt(idStr, 10);

  const submission = useStoreState(
    state => state.submission.submissions.find(submission => submission.id === id)
  );

  return (
    <>
      <Title>#{id}</Title>

      {submission && (
        <>
          <Spacer left={Padding.Normal}/>
          <Text>[{submission.taskName}]</Text>

          {(submission.points !== undefined && submission.status) && (
            <>
              <Spacer left={Padding.Normal}/>
              <Text weight={FontWeight.Bold}>
                <Result mark points={submission.points} status={submission.status}/>
              </Text>
            </>
          )}

          {submission.submitted && (
            <>
              <Spacer left={Padding.Normal}/>
              <Text>
                <PrettyDate timestamp={submission.submitted} />
              </Text>
            </>
          )}
        </>)
      }
    </>
  );
};

export default SubmissionHeading;
