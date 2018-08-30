import React, {Component} from 'react';
import {Container} from 'flux/utils';

import {select, event} from 'd3-selection';

import AppStore from './../data/AppStore';

import NodeContainer from './../components/Node/Container';
import Link from './../components/Link';

import './App.less';

import AppActions from './../data/AppActions';

class AppContainer extends Component {
    static getStores() {
        return [ AppStore ];
    }

    static calculateState() {
        return { app: AppStore.getState() };
    }

    componentWillMount() {
        Promise.all([
            fetch(`${JSON_SERVER}nodes`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${BASIC_AUTH}`
                }
            }).then(res => res.json()),
            fetch(`${JSON_SERVER}links`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${BASIC_AUTH}`
                }
            }).then(res => res.json())
        ]).then(results => {
            AppActions.initialize({
                nodes: results[0],
                links: results[1]
            });
        });
    }

    render () {
        const nodes = this.state.app.nodes;
        const links = this.state.app.links;

        return <svg width="100%" weight="100%">
            <g className="nodes">
                {
                    nodes.map((node, key) =>
                        <NodeContainer key={key}
                            type={node.type}
                            id={node.id}

                            x={node.position.x || 0}
                            y={node.position.y || 0}

                            inputs={node.inputs}
                            outputs={node.outputs} />)
                }
            </g>

            <g className="links">
                {
                    links.map((link, key) =>
                        <Link key={key}
                            id={link.id}
                            begin={link.begin}
                            end={link.end} />)
                }
            </g>
        </svg>;
    }

    componentDidMount() {
        select('svg').on('click', () => {
            if (['circle'].indexOf(event.target.tagName) === -1)
                this.clearDidNotLinked();
        });
    }

    clearDidNotLinked() {
        const links = this.state.app.links;
        const index = links.findIndex(link => !link.id);

        if (index !== -1) {
            links.splice(index, 1);

            this.setState({ app: { ...this.state.app, links }});
        }
    }
}

export default Container.create(AppContainer);