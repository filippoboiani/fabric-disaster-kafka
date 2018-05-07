/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
// import Card, { CardContent } from 'material-ui/Card';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { PieChart, Pie, Tooltip, Legend } from 'recharts';
import txByOrg from '../../store/reducers/txByOrg';
const colors = ['#0B091A','#6283D0','#0D3799','#7C7C7C'];
class OrgPieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                { value: 43, name: "OrdererMSP", fill: "#0B091A" },
                { value: 60, name: "Org1MSP", fill: "#6283D0" },
                { value: 23, name: "Org2MSP", fill: "#0D3799" }
            ]

        }
    }
    componentWillReceiveProps(nextProps){
        var temp = [];
        var index = 0;
        nextProps.txByOrg.forEach(element => {
            temp.push({value: parseInt(element.count), name: element.creator_msp_id,
            fill: colors[index]});
            index++;
        });
        this.setState({data:temp});
    }
    componentDidMount() {
    }
    render() {
        return (
            <div className="chart-stats">
                <Card>
                    <CardHeader>
                        <h5>Organization Transactions</h5>
                    </CardHeader>
                    <CardBody>
                        <PieChart width={535} height={230}>
                            <Legend align="right" height={15} />
                            <Pie data={this.state.data} dataKey="value" nameKey="name" cx="50%" cy="50%"  outerRadius={50} label fill="fill" />
                            <Tooltip />
                        </PieChart>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default OrgPieChart;