import G6 from '@antv/g6';

G6.registerNode(
  'tree-node',
  {
    drawShape: function drawShape(cfg, group) {
      const rect = group.addShape('rect', {
        attrs: {
          fill: '#fff',
          stroke: '#666',
        },
        name: 'rect-shape',
      });
      const content = cfg.name.replace(/(.{19})/g, '$1\n');
      const text = group.addShape('text', {
        attrs: {
          text: content,
          x: 0,
          y: 0,
          textAlign: 'left',
          textBaseline: 'middle',
          fill: '#666',
        },
        name: 'rect-shape',
      });
      const bbox = text.getBBox();
      const hasChildren = cfg.children && cfg.children.length > 0;
      if (hasChildren) {
        group.addShape('marker', {
          attrs: {
            x: bbox.maxX + 12,
            y: 0,
            r: 6,
            symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
            stroke: '#666',
            lineWidth: 2,
          },
          name: 'collapse-icon',
        });
      }
      rect.attr({
        x: bbox.minX - 4,
        y: bbox.minY - 6,
        width: bbox.width + (hasChildren ? 26 : 8),
        height: bbox.height + 12,
      });
      return rect;
    },
  },
  'single-node',
);

const width = document.getElementById('container').scrollWidth;
const height = document.getElementById('container').scrollHeight || 500;
const graph = new G6.TreeGraph({
  container: 'container',
  width,
  height,
  modes: {
    default: [
      {
        type: 'collapse-expand',
        onChange: function onChange(item, collapsed) {
          const data = item.get('model');
          const icon = item.get('group').find((element) => element.get('name') === 'collapse-icon');
          if (collapsed) {
            icon.attr('symbol', G6.Marker.expand);
          } else {
            icon.attr('symbol', G6.Marker.collapse);
          }
          data.collapsed = collapsed;
          return true;
        },
      },
      'drag-canvas',
      'zoom-canvas',
    ],
  },
  defaultNode: {
    type: 'tree-node',
    anchorPoints: [
      [0, 0.5],
      [1, 0.5],
    ],
  },
  defaultEdge: {
    type: 'cubic-horizontal',
    style: {
      stroke: '#A3B1BF',
    },
  },
  layout: {
    type: 'compactBox',
    direction: 'LR',
    getId: function getId(d) {
      return d.id;
    },
    getHeight: function getHeight() {
      return 16;
    },
    getWidth: function getWidth() {
      return 16;
    },
    getVGap: function getVGap() {
      return 20;
    },
    getHGap: function getHGap() {
      return 80;
    },
  },
});
fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/modeling-methods.json')
  .then((res) => res.json())
  .then((data) => {
    G6.Util.traverseTree(data, function (item) {
      item.id = item.name;
    });
    graph.data(data);
    graph.render();
    graph.fitView();
  });
