'use strict';
/**
 * Returns the display name of the specified component (if defined).
 * @param Component
 * @return {*|string}
 */
module.exports = (Component) => {
    return Component.displayName || Component.name || 'Component'
};