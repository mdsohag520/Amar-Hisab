const os = require('node:os');

const originalCpus = os.cpus;

os.cpus = function () {
  const detected = originalCpus.call(os);

  if (detected.length > 0) {
    return detected;
  }

  const count =
    typeof os.availableParallelism === 'function'
      ? os.availableParallelism()
      : 1;

  return Array.from({ length: Math.max(1, count) }, () => ({
    model: 'Android CPU',
    speed: 0,
    times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 }
  }));
};
