import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useStoreState } from 'easy-peasy'
import { useParams } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { Jumbotron } from 'react-bootstrap'
import uuid from 'react-uuid';
import { Result } from '../components/Result';
import { StatusColor } from '../components/Status'




const OneSubmissionPage = () => {
    const {t} = useTranslation();
    const points = 5;
    const status = ['TL'];
    const allpoints = 15;
return (
<>
    <div style={{width : '49%',fontSize : 24, float : "left"}}>
    <h3>Submission {}</h3>

    <Table borderless>
    <thead>
        <tr>
        <th scope="col"></th>
        <th scope="col"></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td >{[t('submissionPage.task') ]}</td>
            <td>Hello world</td>
        </tr>
        <tr>
            <td>{[t('submissionPage.submitted')]}</td>
            <td>15.01.2001</td>
        </tr>
        <tr>
            <td>{[t('submissionPage.checked')]}</td>
            <td>24.03.2020</td>
        </tr>
        <tr>
            <td>{[t('submissionPage.result')]}</td>
            <td><Result points= {allpoints} status = {status} /></td>
        </tr>
    </tbody>

    </Table>
    <Table striped hover variant="dark" size="sm" borderless>
      <thead className="customhead">
        <tr>
          {[t('headers.num'),
            t('headers.points'),
            t('headers.status'),
            t('headers.realTime'),
            t('headers.cpuTime'),
          ].map((header) => (<th key={uuid()} style={{ fontSize: 18 }}>{header}</th>))}
        </tr>
      </thead>
     <tbody>
        <tr>
            <td>1</td>
            <td>{points}</td>
            <td><StatusColor  points = {points} status= {status}></StatusColor></td>
            <td>1.54 s</td>
            <td>0.45</td>
        </tr>
        <tr>
            <td>2</td>
            <td>{10}</td>
            <td><StatusColor  points = {10} status= {["Ok"]}></StatusColor></td>
            <td>1.54 s</td>
            <td>0.45</td>
        </tr>
        <tr>
            <td>3</td>
            <td>{0}</td>
            <td><StatusColor  points = {0} status= {["TL", 'WA']}></StatusColor></td>
            <td>1.54 s</td>
            <td>0.45</td>
        </tr>
        
     </tbody>

         
    </Table>
    </div>
          <div style={{width : '49%',fontSize : 20, float : "right"}}>
                <h3>Your code:</h3>
                <Jumbotron >print('Hello world!')</Jumbotron>
          </div>
</>
);

}
export default OneSubmissionPage