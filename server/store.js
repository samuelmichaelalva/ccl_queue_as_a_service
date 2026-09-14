// In-Memory Data Store for QueuePulse QaaS (PostgreSQL Schema Compatible)

export class QueueStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.businesses = [
      {
        id: 'biz_metro',
        name: 'Metro Health Clinic',
        category: 'Healthcare',
        branch: 'Main Downtown Branch',
        address: '104 Healthcare Blvd, Metro City',
        partnerBranches: [
          { id: 'biz_metro_north', name: 'Metro Health North Care Center', distance: '1.2 km', driveTime: '4 mins', currentAvgWait: '3 min' }
        ],
        departments: [
          {
            id: 'dept_pharmacy',
            name: 'Pharmacy & Dispense',
            prefix: 'P',
            icon: 'Pill',
            color: 'amber',
            avgServiceTimeMinutes: 4,
            counters: [
              { id: 'cnt_p1', name: 'Window 01 - Express Rx', staff: 'Nurse Emily', status: 'SERVING', currentTicketId: 't_p103' },
              { id: 'cnt_p2', name: 'Window 02 - General Rx', staff: 'Pharm. David', status: 'SERVING', currentTicketId: 't_p104' },
              { id: 'cnt_p3', name: 'Window 03 - Special Order', staff: 'Unassigned', status: 'OFFLINE', currentTicketId: null }
            ],
            waitingQueue: [
              { id: 't_p105', token: 'P-105', customerName: 'Marcus Vance', serviceType: 'Rapid Prescription Dispense', priority: 'NORMAL', waitMinutes: 3, createdAt: Date.now() - 180000, targetUser: 'guest_alex' },
              { id: 't_p106', token: 'P-106', customerName: 'Priya Nair', serviceType: 'Refill Collection', priority: 'NORMAL', waitMinutes: 6, createdAt: Date.now() - 360000, targetUser: 'user_priya' },
              { id: 't_p107', token: 'P-107', customerName: 'Arjun Mehta', serviceType: 'Compound Prescription', priority: 'VIP', waitMinutes: 8, createdAt: Date.now() - 480000, targetUser: 'user_arjun' },
              { id: 't_p108', token: 'P-108', customerName: 'Neha Kapoor', serviceType: 'Prescription Dispense', priority: 'NORMAL', waitMinutes: 11, createdAt: Date.now() - 660000, targetUser: 'user_neha' }
            ],
            servingTickets: [
              { id: 't_p103', token: 'P-103', customerName: 'Elena Rostova', serviceType: 'Prescription Dispense', counterId: 'cnt_p1', startedAt: Date.now() - 120000 },
              { id: 't_p104', token: 'P-104', customerName: 'John Doe', serviceType: 'Rapid Prescription Dispense', counterId: 'cnt_p2', startedAt: Date.now() - 240000 }
            ],
            completedToday: 54,
            dailyArrivals: 72
          },
          {
            id: 'dept_opd',
            name: 'General OPD & Triage',
            prefix: 'A',
            icon: 'Stethoscope',
            color: 'emerald',
            avgServiceTimeMinutes: 6,
            counters: [
              { id: 'cnt_a1', name: 'Counter 01 - Triage Room A', staff: 'Dr. Sarah Lin', status: 'SERVING', currentTicketId: 't_a038' },
              { id: 'cnt_a2', name: 'Counter 02 - Triage Room B', staff: 'Dr. Michael Chen', status: 'ONLINE', currentTicketId: null },
              { id: 'cnt_a3', name: 'Counter 03 - Fast Track', staff: 'Dr. Jessica Taylor', status: 'ONLINE', currentTicketId: null }
            ],
            waitingQueue: [
              { id: 't_a039', token: 'A-039', customerName: 'Priya Nair', serviceType: 'General Consultation', priority: 'NORMAL', waitMinutes: 2, createdAt: Date.now() - 120000, targetUser: 'user_priya' },
              { id: 't_a040', token: 'A-040', customerName: 'Arjun Mehta', serviceType: 'Triage Checkup', priority: 'EMERGENCY', waitMinutes: 5, createdAt: Date.now() - 300000, targetUser: 'user_arjun' },
              { id: 't_a041', token: 'A-041', customerName: 'Neha Kapoor', serviceType: 'Follow-up Consultation', priority: 'NORMAL', waitMinutes: 8, createdAt: Date.now() - 480000, targetUser: 'user_neha' },
              { id: 't_a042', token: 'A-042', customerName: 'Vikram Singh', serviceType: 'General Consultation', priority: 'NORMAL', waitMinutes: 11, createdAt: Date.now() - 660000, targetUser: 'guest_alex' },
              { id: 't_a043', token: 'A-043', customerName: 'Ananya Das', serviceType: 'General Consultation', priority: 'NORMAL', waitMinutes: 14, createdAt: Date.now() - 840000, targetUser: 'user_ananya' }
            ],
            servingTickets: [
              { id: 't_a038', token: 'A-038', customerName: 'Marcus Vance', serviceType: 'General Consultation & Triage', counterId: 'cnt_a1', startedAt: Date.now() - 252000 }
            ],
            completedToday: 47,
            dailyArrivals: 68
          },
          {
            id: 'dept_diagnostics',
            name: 'Diagnostics & Labs',
            prefix: 'D',
            icon: 'FlaskConical',
            color: 'violet',
            avgServiceTimeMinutes: 5,
            counters: [
              { id: 'cnt_d1', name: 'Lab Window 1', staff: 'Tech Robert', status: 'SERVING', currentTicketId: 't_d012' },
              { id: 'cnt_d2', name: 'Lab Window 2', staff: 'Tech Clara', status: 'ONLINE', currentTicketId: null }
            ],
            waitingQueue: [
              { id: 't_d013', token: 'D-013', customerName: 'Sanjay Gupta', serviceType: 'Blood Chemistry', priority: 'NORMAL', waitMinutes: 4, createdAt: Date.now() - 240000 },
              { id: 't_d014', token: 'D-014', customerName: 'Rachel Green', serviceType: 'X-Ray Imaging', priority: 'VIP', waitMinutes: 9, createdAt: Date.now() - 540000 }
            ],
            servingTickets: [
              { id: 't_d012', token: 'D-012', customerName: 'Daniel Craig', serviceType: 'Blood Test Sample', counterId: 'cnt_d1', startedAt: Date.now() - 180000 }
            ],
            completedToday: 38,
            dailyArrivals: 46
          },
          {
            id: 'dept_billing',
            name: 'Billing & Insurance',
            prefix: 'B',
            icon: 'FileText',
            color: 'cyan',
            avgServiceTimeMinutes: 3,
            counters: [
              { id: 'cnt_b1', name: 'Cashier 1', staff: 'Officer Lisa', status: 'ONLINE', currentTicketId: null }
            ],
            waitingQueue: [
              { id: 't_b021', token: 'B-021', customerName: 'Kavita Rao', serviceType: 'Cash Settlement', priority: 'NORMAL', waitMinutes: 3, createdAt: Date.now() - 180000 }
            ],
            servingTickets: [],
            completedToday: 62,
            dailyArrivals: 66
          }
        ]
      },
      {
        id: 'biz_apex',
        name: 'Apex Commercial Bank',
        category: 'Banking & Finance',
        branch: 'Central Financial Hub',
        address: '45 Wall Street Plaza',
        partnerBranches: [
          { id: 'biz_apex_west', name: 'Apex Bank Westside Express', distance: '0.8 km', driveTime: '3 mins', currentAvgWait: '2 min' }
        ],
        departments: [
          {
            id: 'dept_cashier',
            name: 'Cash Deposits & Withdrawals',
            prefix: 'C',
            icon: 'Coins',
            color: 'emerald',
            avgServiceTimeMinutes: 3,
            counters: [
              { id: 'cnt_c1', name: 'Teller Window 01', staff: 'James Wilson', status: 'SERVING', currentTicketId: 't_c089' },
              { id: 'cnt_c2', name: 'Teller Window 02', staff: 'Anna Scott', status: 'ONLINE', currentTicketId: null }
            ],
            waitingQueue: [
              { id: 't_c090', token: 'C-090', customerName: 'Alex Morgan', serviceType: 'Cash Deposit', priority: 'NORMAL', waitMinutes: 2, createdAt: Date.now() - 120000, targetUser: 'guest_alex' }
            ],
            servingTickets: [
              { id: 't_c089', token: 'C-089', customerName: 'Devon Miles', serviceType: 'Foreign Exchange', counterId: 'cnt_c1', startedAt: Date.now() - 150000 }
            ],
            completedToday: 88,
            dailyArrivals: 94
          }
        ]
      }
    ];

    this.hourlyArrivalStats = [
      { time: '8 AM', arrivals: 45, served: 35 },
      { time: '9 AM', arrivals: 60, served: 50 },
      { time: '10 AM', arrivals: 95, served: 80 },
      { time: '11 AM', arrivals: 75, served: 70 },
      { time: '12 PM', arrivals: 110, served: 95 },
      { time: '1 PM', arrivals: 145, served: 120 },
      { time: '2 PM', arrivals: 90, served: 85 },
      { time: '3 PM', arrivals: 70, served: 68 },
      { time: '4 PM', arrivals: 130, served: 110 },
      { time: '5 PM', arrivals: 125, served: 115 },
      { time: '6 PM', arrivals: 85, served: 80 },
      { time: '7 PM', arrivals: 50, served: 48 },
      { time: '8 PM', arrivals: 30, served: 28 }
    ];

    this.crossBusinessRedirectionsCount = 84;
    this.totalCustomersToday = 1420;
    this.activeSimulatedSurge = false;
  }

  // Helper Lookups
  getBusiness(bizId) {
    return this.businesses.find(b => b.id === bizId);
  }

  getDepartment(bizId, deptId) {
    const biz = this.getBusiness(bizId);
    if (!biz) return null;
    return biz.departments.find(d => d.id === deptId);
  }

  getAllActiveTicketsForUser(userId = 'guest_alex') {
    const userTickets = [];
    this.businesses.forEach(biz => {
      biz.departments.forEach(dept => {
        // Check in waiting
        const waitingIdx = dept.waitingQueue.findIndex(t => t.targetUser === userId);
        if (waitingIdx !== -1) {
          const ticket = dept.waitingQueue[waitingIdx];
          const activeCountersCount = Math.max(1, dept.counters.filter(c => c.status === 'ONLINE' || c.status === 'SERVING').length);
          const estimatedWait = Math.round((waitingIdx + 1) * (dept.avgServiceTimeMinutes / activeCountersCount));
          
          userTickets.push({
            ...ticket,
            businessId: biz.id,
            businessName: biz.name,
            departmentId: dept.id,
            departmentName: dept.name,
            status: 'WAITING',
            positionInQueue: waitingIdx + 1,
            estimatedWaitMinutes: estimatedWait,
            activeCounters: activeCountersCount,
            nowServingToken: dept.servingTickets.length > 0 ? dept.servingTickets[0].token : 'None',
            partnerBranch: biz.partnerBranches && biz.partnerBranches.length > 0 ? biz.partnerBranches[0] : null
          });
        }

        // Check in serving
        const servingTicket = dept.servingTickets.find(t => t.customerName.toLowerCase().includes('marcus') || t.customerName.toLowerCase().includes('alex') || t.id === 't_p104');
        if (servingTicket && userId === 'guest_alex' && !userTickets.some(ut => ut.id === servingTicket.id)) {
          const counter = dept.counters.find(c => c.id === servingTicket.counterId);
          userTickets.push({
            ...servingTicket,
            businessId: biz.id,
            businessName: biz.name,
            departmentId: dept.id,
            departmentName: dept.name,
            status: 'SERVING',
            counterName: counter ? counter.name : 'Counter 01',
            positionInQueue: 0,
            estimatedWaitMinutes: 0,
            nowServingToken: servingTicket.token
          });
        }
      });
    });
    return userTickets;
  }

  // Create a new queue token
  joinQueue(bizId, deptId, customerName, serviceType, priority = 'NORMAL', userId = 'guest_alex') {
    const dept = this.getDepartment(bizId, deptId);
    if (!dept) throw new Error('Department not found');

    const nextNumber = dept.dailyArrivals + 1;
    dept.dailyArrivals = nextNumber;
    const token = `${dept.prefix}-${String(nextNumber).padStart(3, '0')}`;
    const newTicket = {
      id: `t_${Date.now()}`,
      token,
      customerName,
      serviceType,
      priority,
      waitMinutes: 0,
      createdAt: Date.now(),
      targetUser: userId
    };

    dept.waitingQueue.push(newTicket);
    this.totalCustomersToday += 1;
    return newTicket;
  }

  // Staff: Call Next Ticket
  callNext(bizId, deptId, counterId) {
    const dept = this.getDepartment(bizId, deptId);
    if (!dept) throw new Error('Department not found');

    const counter = dept.counters.find(c => c.id === counterId);
    if (!counter) throw new Error('Counter not found');

    // If currently serving a ticket, finish it first
    if (counter.currentTicketId) {
      this.completeTicket(bizId, deptId, counterId);
    }

    if (dept.waitingQueue.length === 0) {
      counter.status = 'ONLINE';
      counter.currentTicketId = null;
      return null;
    }

    // Sort queue with priority (EMERGENCY -> VIP -> NORMAL)
    const priorityWeight = { 'EMERGENCY': 3, 'VIP': 2, 'NORMAL': 1 };
    dept.waitingQueue.sort((a, b) => priorityWeight[b.priority || 'NORMAL'] - priorityWeight[a.priority || 'NORMAL']);

    const nextTicket = dept.waitingQueue.shift();
    counter.status = 'SERVING';
    counter.currentTicketId = nextTicket.id;

    const servingRecord = {
      ...nextTicket,
      counterId: counter.id,
      startedAt: Date.now()
    };
    dept.servingTickets.push(servingRecord);

    return servingRecord;
  }

  // Staff: Complete Serving Ticket
  completeTicket(bizId, deptId, counterId) {
    const dept = this.getDepartment(bizId, deptId);
    if (!dept) return null;

    const counter = dept.counters.find(c => c.id === counterId);
    if (!counter || !counter.currentTicketId) return null;

    const ticketId = counter.currentTicketId;
    dept.servingTickets = dept.servingTickets.filter(t => t.id !== ticketId);
    dept.completedToday += 1;
    counter.status = 'ONLINE';
    counter.currentTicketId = null;
    return ticketId;
  }

  // Staff: Skip / No-Show Ticket
  skipTicket(bizId, deptId, counterId) {
    const dept = this.getDepartment(bizId, deptId);
    if (!dept) return null;
    const counter = dept.counters.find(c => c.id === counterId);
    if (!counter || !counter.currentTicketId) return null;

    const ticketId = counter.currentTicketId;
    dept.servingTickets = dept.servingTickets.filter(t => t.id !== ticketId);
    counter.status = 'ONLINE';
    counter.currentTicketId = null;
    return ticketId;
  }

  // Open / Add a new counter (AI Recommendation trigger)
  openRecommendedCounter(bizId, deptId) {
    const dept = this.getDepartment(bizId, deptId);
    if (!dept) return null;

    let offlineCounter = dept.counters.find(c => c.status === 'OFFLINE');
    if (offlineCounter) {
      offlineCounter.status = 'ONLINE';
      offlineCounter.staff = 'AI Reallocated Staff (Dr. K. Patel)';
    } else {
      const newCounterNum = dept.counters.length + 1;
      const newCounter = {
        id: `cnt_${dept.prefix.toLowerCase()}${newCounterNum}`,
        name: `Counter 0${newCounterNum} - Dynamic Relief`,
        staff: 'AI Reallocated Staff',
        status: 'ONLINE',
        currentTicketId: null
      };
      dept.counters.push(newCounter);
      offlineCounter = newCounter;
    }
    return offlineCounter;
  }

  // Smart Redirection: Switch a ticket to a partner branch
  rerouteTicket(ticketId, targetBranchId) {
    this.crossBusinessRedirectionsCount += 1;
    return { success: true, message: `Ticket ${ticketId} rerouted to partner branch ${targetBranchId}. Wait time reduced by 18 mins.` };
  }

  // Simulate Surge
  toggleSimulateSurge() {
    this.activeSimulatedSurge = !this.activeSimulatedSurge;
    const pharmacy = this.getDepartment('biz_metro', 'dept_pharmacy');
    if (pharmacy) {
      if (this.activeSimulatedSurge) {
        pharmacy.avgServiceTimeMinutes = 8;
        // Inject 3 extra surge tickets
        const surgeCustomers = [
          { name: 'Dr. Watson Emergency Care', serviceType: 'Stat Antibiotics', priority: 'EMERGENCY' },
          { name: 'Chloe Bailey', serviceType: 'Pediatric Rx', priority: 'VIP' },
          { name: 'Sam Altman', serviceType: 'Rapid Prescription', priority: 'NORMAL' }
        ];
        surgeCustomers.forEach(sc => {
          this.joinQueue('biz_metro', 'dept_pharmacy', sc.name, sc.serviceType, sc.priority, `user_${Date.now()}`);
        });
      } else {
        pharmacy.avgServiceTimeMinutes = 4;
      }
    }
    return this.activeSimulatedSurge;
  }
}

export const queueStore = new QueueStore();
