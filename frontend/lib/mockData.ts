export const mockActiveShipments = [
  {
    id: "CH-2024-0821",
    status: "In Transit",
    pickup: "Mumbai",
    drop: "Pune",
    vehicle: "Tempo",
    driver: {
      name: "Ramesh K.",
      rating: 4.8,
      phone: "+91 9876543210"
    },
    eta: "~45 min",
    progress: 60
  },
  {
    id: "CH-2024-0822",
    status: "Driver Assigned",
    pickup: "Andheri East, Mumbai",
    drop: "Thane",
    vehicle: "Mini",
    driver: {
      name: "Suresh P.",
      rating: 4.9,
      phone: "+91 9876543211"
    },
    eta: "~15 min to pickup",
    progress: 10
  }
];

export const mockRecentOrders = [
  {
    id: "CH-2024-0821",
    route: "Mumbai → Pune",
    vehicle: "Tempo",
    date: "08 Jun 2026",
    amount: "₹680",
    status: "In Transit"
  },
  {
    id: "CH-2024-0819",
    route: "Delhi → Gurgaon",
    vehicle: "Mini",
    date: "06 Jun 2026",
    amount: "₹320",
    status: "Delivered"
  },
  {
    id: "CH-2024-0801",
    route: "Bangalore → Mysore",
    vehicle: "Truck",
    date: "01 Jun 2026",
    amount: "₹2,100",
    status: "Delivered"
  },
  {
    id: "CH-2024-0788",
    route: "Pune → Nashik",
    vehicle: "Tempo",
    date: "28 May 2026",
    amount: "₹890",
    status: "Cancelled"
  }
];

export const mockNotifications = [
  {
    id: 1,
    type: "status",
    message: "Your driver Ramesh has picked up your cargo.",
    time: "2 min ago",
    read: false
  },
  {
    id: 2,
    type: "payment",
    message: "Payment of ₹680 received successfully.",
    time: "1 hr ago",
    read: false
  },
  {
    id: 3,
    type: "location",
    message: "Your shipment CH-0821 is 5km away.",
    time: "3 hr ago",
    read: true
  },
  {
    id: 4,
    type: "promo",
    message: "Use code CARGO50 for 50% off your next booking",
    time: "1 day ago",
    read: true
  }
];

export const mockAddresses = [
  {
    id: 1,
    label: "Home",
    address: "123 Linking Road, Bandra West, Mumbai, MH 400050",
    isDefault: true
  },
  {
    id: 2,
    label: "Office",
    address: "Plot 45, IT Park, Hinjewadi, Pune, MH 411057",
    isDefault: false
  }
];
