import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import flowDiagramsData from '../data/flowDiagrams-horizontal.json';
import NodeTypes from './flow/NodeTypes';
import { getFlowDisplayName } from './flow/FlowUtils';

/**
 * Flow Diagram Component that displays interactive architecture diagrams
 * @returns {JSX.Element} The FlowDiagram component
 */
const FlowDiagram = () => {
  const flowRef = useRef(null);
  
  // State to toggle between different flow diagrams
  const [flowType, setFlowType] = useState('microsoft');
  
  // Get nodes and edges from the JSON data based on the selected flow type
  const initialNodes = flowDiagramsData[flowType]?.nodes || [];
  const initialEdges = flowDiagramsData[flowType]?.edges || [];
  
  // Initialize nodes and edges based on the selected flow type
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  /**
   * Handle flow type change
   * @param {string} type - The flow type to change to
   */
  const handleFlowTypeChange = useCallback((type) => {
    if (flowDiagramsData[type]) {
      setFlowType(type);
      setNodes(flowDiagramsData[type].nodes);
      setEdges(flowDiagramsData[type].edges);
    }
  }, [setNodes, setEdges]);

  // Ensure the component is properly sized
  useEffect(() => {
    // Small delay to ensure the DOM is fully rendered
    const timer = setTimeout(() => {
      if (flowRef.current) {
        // Force a window resize event to make React Flow recalculate dimensions
        window.dispatchEvent(new Event('resize'));
        
        // Get the flow instance and fit view with padding
        if (flowRef.current) {
          const { fitView } = flowRef.current;
          if (typeof fitView === 'function') {
            fitView({ padding: 0.2, includeHiddenNodes: false });
          }
        }
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [flowType]);

  // Get available flow types from the JSON data
  const availableFlowTypes = Object.keys(flowDiagramsData);

  return (
    <div 
      className="flow-container" 
      ref={flowRef}
      style={{
        width: '100%',
        height: '600px',
        minWidth: '1200px',
        minHeight: '500px',
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
        nodeTypes={NodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
        attributionPosition="bottom-right"
        style={{ width: '100%', height: '100%' }}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap 
          nodeStrokeWidth={3}
          zoomable 
          pannable
          style={{ 
            backgroundColor: '#f8f8f8',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
        <Panel position="top-left" className="bg-white p-2 rounded-md shadow-md">
          <div className="flex flex-wrap gap-2">
            {availableFlowTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleFlowTypeChange(type)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  flowType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {getFlowDisplayName(type)}
              </button>
            ))}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

/**
 * @typedef {Object} FlowDiagramProps
 */

/**
 * @type {FlowDiagramProps}
 */
export default FlowDiagram;
