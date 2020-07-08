import * as React from 'react';
import {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Col, Row} from '@/atoms/grid';
import Table from '@/molecules/table';
import HtmlTextSection from '@/molecules/htmlTextSection';
import Defined from '@/helpers/defined';
import {Title} from '@/atoms/typography';
import Paper from '@/atoms/paper';
import TaskFromURL from '@/providers/taskFromURL';
import TaskDescriptionSections from '@/providers/taskDescriptionSections';
import styled from 'styled-components';
import WithSubmissionArea from '@/templates/withSubmissionArea';
import Page from '~/components/templates/page';
import Spacer from "@/atoms/spacer";
import {Padding} from "~/mixins/padding";
import Modal from "@/molecules/modal";
import Fade from "@/animations/fade";

const Td = styled.td`
  vertical-align: top;
  white-space: pre-line;
`;

const TaskPage: FC = () => {
  const {t} = useTranslation();

  return (
    <>
      <Page>
        <TaskFromURL>
          {(task) => (
            <>
              <Paper>
                <TaskDescriptionSections task={task}>
                  {(sections) =>
                    sections.map((section) => (
                      <HtmlTextSection
                        key={section.id}
                        text={section.text || ''}
                        header={section.header || ''}
                      />
                    ))
                  }
                </TaskDescriptionSections>
              </Paper>

              <Defined value={task.examples}>
                {(definedExamples) => (
                  <>
                    <Spacer top={Padding.Large}/>

                    <Table>
                      <thead>
                      <tr>
                        <th>{t('headers.input')}</th>
                        <th>{t('headers.output')}</th>
                      </tr>
                      </thead>
                      <tbody>
                      {definedExamples.map((example) => (
                        <tr key={example.input + example.output}>
                          <Td>{example.input}</Td>
                          <Td>{example.output}</Td>
                        </tr>
                      ))}
                      </tbody>
                    </Table>
                  </>
                )}
              </Defined>
            </>
          )}
        </TaskFromURL>
      </Page>

      <Modal active={false}>

      </Modal>
    </>
  );
};

export default TaskPage;
