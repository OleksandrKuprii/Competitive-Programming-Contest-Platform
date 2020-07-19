import * as React from 'react';
import {FC} from 'react';
import {useTranslation} from 'react-i18next';
import { Table, TableCol } from '@/toucanui/molecules/table';
import HtmlTextSection from '@/molecules/htmlTextSection';
import TaskFromURL from '@/providers/taskFromURL';
import TaskDescriptionSections from '@/providers/taskDescriptionSections';
import styled from 'styled-components';
import Page from '@/toucanui/templates/page';
import Spacer from "@/toucanui/atoms/spacer";
import {Padding} from "~/mixins/padding";
import Paper from '@/toucanui/atoms/paper';
import {useStoreState} from "~/hooks/store";

// const Td = styled.td`
//   vertical-align: top;
//   white-space: pre-line;
// `;

const TaskPage: FC = () => {
  const {t} = useTranslation();

  const fontDelta = useStoreState(state => state.customFont.fontDelta);

  const fontSize = 18 + fontDelta;

  return (
    <>
      <Page>
        <TaskFromURL>
          {(task) => (
            <>
              <Paper style={{ fontSize }}>
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

              {task.examples &&
              <>
                <Spacer top={Padding.Large}/>

                <Table cols={2}>
                  <TableCol header>{t('headers.input')}</TableCol>
                  <TableCol header>{t('headers.output')}</TableCol>
                  {task.examples.map((example) => (
                    <React.Fragment key={example.input + example.output}>
                      <TableCol>{example.input}</TableCol>
                      <TableCol>{example.output}</TableCol>
                    </React.Fragment>
                  ))}
                </Table>
              </>
              }
            </>
          )}
        </TaskFromURL>
      </Page>
    </>
  );
};

export default TaskPage;
