const delayMiddleware = (delayTime = 1000) => {
  return (req, res, next) => {
    setTimeout(() => {
      next();
    }, delayTime);
  };
};

// Export với delay mặc định 1 giây
module.exports = delayMiddleware;

// Export function tùy chỉnh delay
module.exports.customDelay = (time) => delayMiddleware(time);
