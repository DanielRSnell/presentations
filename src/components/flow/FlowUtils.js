/**
 * Utility functions for working with flow diagrams
 */

/**
 * Get a display name for a flow type
 * @param {string} type - The flow type identifier
 * @returns {string} - A formatted display name
 */
export const getFlowDisplayName = (type) => {
  switch (type) {
    case 'microsoft':
      return 'Microsoft CoPilot Stack';
    case 'n8n':
      return 'N8N-Based Solution';
    case 'ai-powered':
      return 'AI-Powered Architecture';
    default:
      // Capitalize first letter and replace hyphens with spaces
      return type
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  }
};

/**
 * Create a new node for a flow diagram
 * @param {string} id - Unique identifier for the node
 * @param {string} type - Node type (matches a key in NodeTypes)
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {string} label - Node label
 * @param {string} description - Node description
 * @param {Object} options - Additional options
 * @param {string} [options.domain] - Domain for logo (for logo.dev)
 * @param {string} [options.direction] - Flow direction ('horizontal' or 'vertical')
 * @returns {Object} - Node object for React Flow
 */
export const createNode = (id, type, x, y, label, description, options = {}) => {
  return {
    id,
    type,
    position: { x, y },
    data: {
      label,
      description,
      cardType: type,
      domain: options.domain || null,
      direction: options.direction || 'vertical'
    }
  };
};

/**
 * Create a new edge between nodes
 * @param {string} id - Unique identifier for the edge
 * @param {string} source - Source node id
 * @param {string} target - Target node id
 * @param {string} label - Edge label
 * @param {boolean} animated - Whether the edge should be animated
 * @param {string} [sourceHandle='bottom'] - Source handle position ('bottom', 'top', 'left', 'right')
 * @param {string} [targetHandle='top'] - Target handle position ('bottom', 'top', 'left', 'right')
 * @returns {Object} - Edge object for React Flow
 */
export const createEdge = (
  id, 
  source, 
  target, 
  label, 
  animated = true, 
  sourceHandle = 'bottom', 
  targetHandle = 'top'
) => {
  return {
    id,
    source,
    target,
    sourceHandle,
    targetHandle,
    animated,
    label,
    type: 'smoothstep'
  };
};

/**
 * Export a flow diagram to JSON
 * @param {Array} nodes - Array of nodes
 * @param {Array} edges - Array of edges
 * @returns {Object} - JSON representation of the flow diagram
 */
export const exportFlowToJson = (nodes, edges) => {
  return {
    nodes,
    edges
  };
};

/**
 * Import a flow diagram from JSON
 * @param {Object} json - JSON representation of the flow diagram
 * @returns {Object} - Object with nodes and edges arrays
 */
export const importFlowFromJson = (json) => {
  return {
    nodes: json.nodes || [],
    edges: json.edges || []
  };
};
