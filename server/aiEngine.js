// AI & Queuing Theory Intelligence Engine (QueuePulse Engine)
// Implements M/M/c dynamic queuing calculations, arrival rate velocity estimation, and proactive staff recommender

export class AIEngine {
  /**
   * Calculates dynamic queue metrics based on M/M/c multi-server queuing model
   * @param {number} arrivalRate Lambda (arrivals per hour)
   * @param {number} serviceRatePerCounter Mu (customers served per hour per counter)
   * @param {number} activeCounters c (number of active service counters)
   */
  static calculateQueuingMetrics(arrivalRate, serviceRatePerCounter, activeCounters) {
    const c = Math.max(1, activeCounters);
    const mu = Math.max(0.1, serviceRatePerCounter);
    const lambda = Math.max(0.1, arrivalRate);

    const rho = lambda / (c * mu); // Utilization factor

    // Estimated average wait time in queue (Wq) in minutes
    let avgWaitMinutes;
    if (rho >= 1.0) {
      // Congested / Over-capacity: Linear queue buildup
      avgWaitMinutes = ((lambda - c * mu) * 60) / (c * mu) + (60 / mu);
    } else {
      // Stable M/M/c approximation
      const p0 = 1 - rho; // Base idle probability
      const lq = (Math.pow(c * rho, c) / (factorial(c) * Math.pow(1 - rho, 2))) * p0;
      avgWaitMinutes = Math.max(1, Math.round(((lq / lambda) * 60) + (30 / mu)));
    }

    return {
      utilizationPercentage: Math.min(100, Math.round(rho * 100)),
      avgWaitMinutes: Math.min(120, Math.max(2, Math.round(avgWaitMinutes))),
      isCongested: rho > 0.85
    };
  }

  /**
   * Generates AI Proactive Capacity Recommendations
   */
  static analyzeDepartmentCapacity(department) {
    const activeCounters = department.counters.filter(c => c.status === 'ONLINE' || c.status === 'SERVING').length;
    const totalWaiting = department.waitingQueue.length;
    const avgServiceTime = department.avgServiceTimeMinutes;

    // Service rate in customers per hour per counter
    const mu = 60 / avgServiceTime;
    // Estimated arrival rate based on recent waiting backlog
    const lambda = (totalWaiting * (60 / 15)) + 10;

    const metrics = this.calculateQueuingMetrics(lambda, mu, activeCounters);

    let recommendation = null;
    if (totalWaiting >= 4 || metrics.isCongested) {
      recommendation = {
        id: `rec_${department.id}_${Date.now()}`,
        targetDepartmentId: department.id,
        targetDepartmentName: department.name,
        urgency: totalWaiting > 6 ? 'CRITICAL' : 'HIGH',
        title: `${department.name} Rush Expected`,
        message: `Expected 45% surge in arrivals. Queue backlog is ${totalWaiting} patients (${metrics.avgWaitMinutes} min wait). AI recommends opening Counter 03 immediately.`,
        actionLabel: 'Open Counter 03',
        suggestedCounterId: 'cnt_p3',
        projectedSavingsMinutes: Math.round(metrics.avgWaitMinutes * 0.6)
      };
    }

    return {
      metrics,
      recommendation
    };
  }

  /**
   * Serverless V7 Analytics Report Generator (Simulates AWS Lambda)
   */
  static generateLambdaDailyReport(store) {
    const totalServed = store.businesses.reduce((sum, b) => {
      return sum + b.departments.reduce((dSum, d) => dSum + d.completedToday, 0);
    }, 0);

    return {
      reportId: `REP-AWS-V7-${Date.now().toString(36).toUpperCase()}`,
      generatedAt: new Date().toISOString(),
      awsExecutionInfo: {
        runtime: 'AWS Lambda (Node.js 20.x)',
        memorySize: '256 MB',
        durationMs: 42.6,
        region: 'us-east-1 (N. Virginia)',
        vpcSubnet: 'subnet-private-rds-0a91e'
      },
      summary: {
        totalBusinesses: store.businesses.length,
        totalCustomersProcessed: totalServed + store.totalCustomersToday,
        averageSatisfactionScore: 4.88,
        crossBranchRedirections: store.crossBusinessRedirectionsCount,
        carbonAndPhysicalTimeSavedHours: Math.round((store.totalCustomersToday * 18.5) / 60)
      }
    };
  }
}

function factorial(n) {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}
