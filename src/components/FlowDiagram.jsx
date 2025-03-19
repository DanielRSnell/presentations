import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  Handle
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Define custom node types
const nodeTypes = {
  service: (props) => (
    <div className="p-3 rounded-md shadow-md bg-white border-2 border-blue-500 min-w-40">
      <Handle type="target" position="top" id="top" />
      <Handle type="source" position="bottom" id="bottom" />
      <div className="font-bold text-blue-700">{props.data.label}</div>
      {props.data.description && <div className="text-xs mt-1 text-gray-600">{props.data.description}</div>}
    </div>
  ),
  database: (props) => (
    <div className="p-3 rounded-md shadow-md bg-white border-2 border-green-500 min-w-40">
      <Handle type="target" position="top" id="top" />
      <Handle type="source" position="bottom" id="bottom" />
      <div className="font-bold text-green-700">{props.data.label}</div>
      {props.data.description && <div className="text-xs mt-1 text-gray-600">{props.data.description}</div>}
    </div>
  ),
  client: (props) => (
    <div className="p-3 rounded-md shadow-md bg-white border-2 border-purple-500 min-w-40">
      <Handle type="target" position="top" id="top" />
      <Handle type="source" position="bottom" id="bottom" />
      <div className="font-bold text-purple-700">{props.data.label}</div>
      {props.data.description && <div className="text-xs mt-1 text-gray-600">{props.data.description}</div>}
    </div>
  )
};

// Initial nodes for Microsoft CoPilot stack
const initialMicrosoftNodes = [
  {
    id: 'ms-1',
    type: 'client',
    position: { x: 250, y: 50 },
    data: { label: 'FreshService', description: 'Ticket Management System' }
  },
  {
    id: 'ms-2',
    type: 'service',
    position: { x: 250, y: 150 },
    data: { label: 'Microsoft Power Automate', description: 'Workflow Automation' }
  },
  {
    id: 'ms-3',
    type: 'service',
    position: { x: 100, y: 250 },
    data: { label: 'Azure Functions', description: 'Serverless Computing' }
  },
  {
    id: 'ms-4',
    type: 'database',
    position: { x: 400, y: 250 },
    data: { label: 'Azure SQL', description: 'Database Storage' }
  },
  {
    id: 'ms-5',
    type: 'service',
    position: { x: 250, y: 350 },
    data: { label: 'Microsoft CoPilot', description: 'AI Assistant Integration' }
  }
];

// Initial edges for Microsoft CoPilot stack
const initialMicrosoftEdges = [
  {
    id: 'ms-e1-2',
    source: 'ms-1',
    target: 'ms-2',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    animated: true,
    label: 'Tickets',
    type: 'smoothstep'
  },
  {
    id: 'ms-e2-3',
    source: 'ms-2',
    target: 'ms-3',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    animated: true,
    label: 'Triggers',
    type: 'smoothstep'
  },
  {
    id: 'ms-e2-4',
    source: 'ms-2',
    target: 'ms-4',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    animated: true,
    label: 'Stores Data',
    type: 'smoothstep'
  },
  {
    id: 'ms-e3-5',
    source: 'ms-3',
    target: 'ms-5',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    animated: true,
    label: 'Processes',
    type: 'smoothstep'
  },
  {
    id: 'ms-e4-5',
    source: 'ms-4',
    target: 'ms-5',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    animated: true,
    label: 'Provides Context',
    type: 'smoothstep'
  }
];

// Initial nodes for N8N-based solution
const initialN8NNodes = [
  {
    id: 'n8n-1',
    type: 'client',
    position: { x: 250, y: 50 },
    data: { label: 'FreshService', description: 'Ticket Management System' }
  },
  {
    id: 'n8n-2',
    type: 'service',
    position: { x: 250, y: 150 },
    data: { label: 'N8N', description: 'Workflow Automation Platform' }
  },
  {
    id: 'n8n-3',
    type: 'service',
    position: { x: 100, y: 250 },
    data: { label: 'Node.js API', description: 'Custom API Services' }
  },
  {
    id: 'n8n-4',
    type: 'database',
    position: { x: 400, y: 250 },
    data: { label: 'PostgreSQL', description: 'Database Storage' }
  },
  {
    id: 'n8n-5',
    type: 'service',
    position: { x: 250, y: 350 },
    data: { label: 'XML to JSON Converter', description: 'Data Transformation Service' }
  }
];

// Initial edges for N8N-based solution
const initialN8NEdges = [
  {
    id: 'n8n-e1-2',
    source: 'n8n-1',
    target: 'n8n-2',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    animated: true,
    label: 'Webhook',
    type: 'smoothstep'
  },
  {
    id: 'n8n-e2-3',
    source: 'n8n-2',
    target: 'n8n-3',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    animated: true,
    label: 'API Calls',
    type: 'smoothstep'
  },
  {
    id: 'n8n-e2-4',
    source: 'n8n-2',
    target: 'n8n-4',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    animated: true,
    label: 'Stores Data',
    type: 'smoothstep'
  },
  {
    id: 'n8n-e3-5',
    source: 'n8n-3',
    target: 'n8n-5',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    animated: true,
    label: 'Processes XML',
    type: 'smoothstep'
  },
  {
    id: 'n8n-e5-4',
    source: 'n8n-5',
    target: 'n8n-4',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    animated: true,
    label: 'Stores JSON',
    type: 'smoothstep'
  }
];

// Flow Diagram Component
const FlowDiagram = () => {
  const flowRef = useRef(null);
  // State to toggle between different flow diagrams
  const [flowType, setFlowType] = useState('microsoft');
  
  // Initialize nodes and edges based on the selected flow type
  const [nodes, setNodes, onNodesChange] = useNodesState(
    flowType === 'microsoft' ? initialMicrosoftNodes : initialN8NNodes
  );
  
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    flowType === 'microsoft' ? initialMicrosoftEdges : initialN8NEdges
  );

  // Handle flow type change
  const handleFlowTypeChange = useCallback((type) => {
    setFlowType(type);
    setNodes(type === 'microsoft' ? initialMicrosoftNodes : initialN8NNodes);
    setEdges(type === 'microsoft' ? initialMicrosoftEdges : initialN8NEdges);
  }, [setNodes, setEdges]);

  // Ensure the component is properly sized
  useEffect(() => {
    // Small delay to ensure the DOM is fully rendered
    const timer = setTimeout(() => {
      if (flowRef.current) {
        // Force a window resize event to make React Flow recalculate dimensions
        window.dispatchEvent(new Event('resize'));
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      ref={flowRef}
      style={{ 
        width: '88rem', 
        height: '450px', 
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        style={{ 
          width: '100%', 
          height: '100%'
        }}
      >
        <Controls />
        <MiniMap />
        <Background color="#aaa" gap={16} />
        
        <Panel position="top-center">
          <div className="bg-white p-2 rounded-md shadow-md flex gap-2">
            <button
              onClick={() => handleFlowTypeChange('microsoft')}
              className={`px-3 py-1 rounded-md ${
                flowType === 'microsoft' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Microsoft CoPilot Stack
            </button>
            <button
              onClick={() => handleFlowTypeChange('n8n')}
              className={`px-3 py-1 rounded-md ${
                flowType === 'n8n' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              N8N-Based Solution
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default FlowDiagram;
