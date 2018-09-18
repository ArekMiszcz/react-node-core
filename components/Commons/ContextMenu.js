import 'react';

import {select, selectAll} from 'd3-selection';

import './ContextMenu.less';

class ContextMenu { 
    margin = 0.1;
    maxWidth = 200;

    height;
    width;
    items = [];
    rescale = false;

    constructor(items) {
        this.rescale = true;
        this.items = items;
    }

    scaleItems() {
        if (this.rescale) {
            select('svg').selectAll('tmp')
                .data(this.items).enter()
                .append('text')
                .text(d => d.text)
                .attr('x', -1000)
                .attr('y', -1000)
                .attr('class', 'tmp');

            const z = selectAll('.tmp').nodes().map(x => x.getBBox());

            const maxTextWidth = Math.max(...z.map(x => x.width));
            const width = maxTextWidth > this.maxWidth ? this.maxWidth : maxTextWidth;
            const margin = this.margin * width;

            this.width =  width + 2 * margin;
            this.height = Math.max(...z.map(x => x.height + margin / 2));
            
            // cleanup
            selectAll('.tmp').remove();

            this.rescale = false;
        }
    }

    menu(x, y) {
        const _self = this;

        select('.context-menu').remove();

        this.scaleItems();

        // Draw the menu
        select('svg')
            .append('g').attr('class', 'context-menu')
            .selectAll('tmp')
            .data(this.items).enter()
            .append('g').attr('class', 'menu-entry')
            .on('mouseover', function() {
                select(this).select('rect').attr('class', 'active'); 
            })
            .on('mouseout', function() {
                select(this).select('rect').attr('class', ''); 
            })
            .on('click', d => d.onClick(d));
        
        selectAll('.menu-entry')
            .append('rect')
            .attr('x', x)
            .attr('y', (d, i) => y + (i * _self.height))
            .attr('width', _self.width)
            .attr('height', _self.height);
        
        selectAll('.menu-entry')
            .append('text')
            .text(d => d.text)
            .attr('x', x)
            .attr('y', (d, i) => y + (i * _self.height))
            .attr('dy', _self.height - 5)
            .attr('dx', 2);

        select('body')
            .on('click', () => {
                select('.context-menu').remove();
            });
    }
}

export default ContextMenu;