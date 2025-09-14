"use client"

import { useState, useEffect } from "react"
import { RoomManagement } from "./room-management"
import { HotelAnalytics } from "./hotel-analytics"
import { HotelDetailsSidebar } from "./hotel-details-sidebar"
import { HotelEditPage } from "./hotel-edit-page"
import { HotelCalendar } from "./hotel-calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, ModernCard } from "@/components/ui/card"
import { useHotelData } from "@/hooks/useHotelData"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatsCard } from "@/components/ui/stats-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Building2,
  Users,
  CreditCard,
  Activity,
  Settings,
  CheckCircle,
  UserPlus,
  Shield,
  Search,
  Download,
  Edit,
  Trash2,
  Lock,
  Unlock,
  MapPin,
  Star,
  Phone,
  Mail,
  Menu,
  Crown,
  User,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Wifi,
  Bell,
  Power,
  PowerOff,
  Battery,
  BatteryWarning,
} from "lucide-react"
import { apiService, Hotel, Room } from '@/lib/api'

// Using shared hotel data from lib/hotel-data.ts

// Mock data for room status
const mockRoomStatus = {
  "1": {
    occupied: 21,
    vacant: 4,
    masterKeys: 15,
    guestKeys: 8,
    totalRooms: 25,
  },
  "2": {
    occupied: 25,
    vacant: 5,
    masterKeys: 18,
    guestKeys: 10,
    totalRooms: 30,
  },
  "3": {
    occupied: 18,
    vacant: 2,
    masterKeys: 12,
    guestKeys: 7,
    totalRooms: 20,
  },
  "4": {
    occupied: 20,
    vacant: 8,
    masterKeys: 15,
    guestKeys: 10,
    totalRooms: 28,
  },
  "5": {
    occupied: 18,
    vacant: 4,
    masterKeys: 12,
    guestKeys: 8,
    totalRooms: 22,
  },
  "6": {
    occupied: 27,
    vacant: 3,
    masterKeys: 18,
    guestKeys: 12,
    totalRooms: 30,
  },
  "7": {
    occupied: 26,
    vacant: 4,
    masterKeys: 18,
    guestKeys: 10,
    totalRooms: 30,
  },
  "8": {
    occupied: 16,
    vacant: 2,
    masterKeys: 10,
    guestKeys: 7,
    totalRooms: 18,
  },
}

// Mock data for hotel users
const mockHotelUsers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@hotel.com",
    role: "manager",
    status: "active",
    lastLogin: "2 hours ago",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@hotel.com",
    role: "staff",
    status: "active",
    lastLogin: "1 hour ago",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike.wilson@hotel.com",
    role: "staff",
    status: "inactive",
    lastLogin: "3 days ago",
    avatar: "/placeholder-user.jpg",
  },
]

// Mock data for dynamic activities
const mockDynamicActivities = {
  "1": [
    { type: "checkin", message: "Guest checked in to Room 101", time: "2 minutes ago", priority: "normal" },
    { type: "security", message: "Security alert: Unauthorized access attempt", time: "5 minutes ago", priority: "high" },
    { type: "service", message: "Room service requested for Room 102", time: "8 minutes ago", priority: "normal" },
    { type: "maintenance", message: "Maintenance request submitted for Room 105", time: "12 minutes ago", priority: "medium" },
    { type: "system", message: "System backup completed successfully", time: "15 minutes ago", priority: "low" },
  ],
  "2": [
    { type: "checkin", message: "VIP guest arrived at Suite 201", time: "1 minute ago", priority: "high" },
    { type: "service", message: "Spa appointment confirmed for Room 205", time: "3 minutes ago", priority: "normal" },
    { type: "checkout", message: "Guest checked out from Room 203", time: "7 minutes ago", priority: "normal" },
    { type: "maintenance", message: "AC system maintenance scheduled", time: "10 minutes ago", priority: "medium" },
    { type: "system", message: "WiFi network optimized", time: "14 minutes ago", priority: "low" },
  ],
  "3": [
    { type: "checkin", message: "Business guest checked in to Room 301", time: "4 minutes ago", priority: "normal" },
    { type: "service", message: "Conference room booking confirmed", time: "6 minutes ago", priority: "high" },
    { type: "maintenance", message: "Elevator maintenance completed", time: "9 minutes ago", priority: "medium" },
    { type: "security", message: "Security system updated", time: "11 minutes ago", priority: "low" },
    { type: "system", message: "Backup generator tested", time: "16 minutes ago", priority: "low" },
  ]
}

// Mock data for individual rooms
const mockRooms = {
  "1": [
    { id: 1, number: "101", status: "vacant", hasMasterKey: false, hasLowPower: false, powerStatus: "off", occupantType: null },
    { id: 2, number: "102", status: "occupied", hasMasterKey: true, hasLowPower: false, powerStatus: "on", occupantType: "guest" },
    { id: 3, number: "103", status: "maintenance", hasMasterKey: true, hasLowPower: false, powerStatus: "on", occupantType: "maintenance" },
    { id: 4, number: "104", status: "maintenance", hasMasterKey: true, hasLowPower: false, powerStatus: "on", occupantType: "maintenance" },
    { id: 5, number: "105", status: "occupied", hasMasterKey: true, hasLowPower: false, powerStatus: "on", occupantType: "guest" },
    { id: 6, number: "106", status: "maintenance", hasMasterKey: true, hasLowPower: false, powerStatus: "on", occupantType: "maintenance" },
    { id: 7, number: "107", status: "vacant", hasMasterKey: true, hasLowPower: false, powerStatus: "off", occupantType: null },
    { id: 8, number: "108", status: "maintenance", hasMasterKey: true, hasLowPower: false, powerStatus: "on", occupantType: "maintenance" },
    { id: 9, number: "109", status: "maintenance", hasMasterKey: true, hasLowPower: false, powerStatus: "on", occupantType: "maintenance" },
    { id: 10, number: "110", status: "vacant", hasMasterKey: true, hasLowPower: false, powerStatus: "off", occupantType: null },
    { id: 11, number: "111", status: "occupied", hasMasterKey: false, hasLowPower: false, powerStatus: "on", occupantType: "guest" },
    { id: 12, number: "112", status: "vacant", hasMasterKey: true, hasLowPower: false, powerStatus: "off", occupantType: null },
    { id: 13, number: "113", status: "vacant", hasMasterKey: true, hasLowPower: false, powerStatus: "off", occupantType: null },
    { id: 14, number: "114", status: "occupied", hasMasterKey: true, hasLowPower: false, powerStatus: "on", occupantType: "manager" },
    { id: 15, number: "115", status: "occupied", hasMasterKey: true, hasLowPower: false, powerStatus: "on", occupantType: "guest" },
  ],
  "2": [
    { id: 1, number: "201", status: "vacant", hasMasterKey: false, hasLowPower: false, powerStatus: "off", occupantType: null },
    { id: 2, number: "202", status: "maintenance", hasMasterKey: true, hasLowPower: false, powerStatus: "on", occupantType: "maintenance" },
    { id: 3, number: "203", status: "vacant", hasMasterKey: true, hasLowPower: false, powerStatus: "off", occupantType: null },
    { id: 4, number: "204", status: "vacant", hasMasterKey: true, hasLowPower: false, powerStatus: "off", occupantType: null },
    { id: 5, number: "205", status: "maintenance", hasMasterKey: true, hasLowPower: false, powerStatus: "on", occupantType: "maintenance" },
    { id: 6, number: "206", status: "maintenance", hasMasterKey: true, hasLowPower: false, powerStatus: "on", occupantType: "maintenance" },
    { id: 7, number: "207", status: "occupied", hasMasterKey: true, hasLowPower: false, powerStatus: "on", occupantType: "guest" },
    { id: 8, number: "208", status: "maintenance", hasMasterKey: true, hasLowPower: false, powerStatus: "on", occupantType: "maintenance" },
    { id: 9, number: "209", status: "maintenance", hasMasterKey: true, hasLowPower: false, powerStatus: "on", occupantType: "maintenance" },
    { id: 10, number: "210", status: "occupied", hasMasterKey: true, hasLowPower: false, powerStatus: "on", occupantType: "manager" },
    { id: 11, number: "211", status: "vacant", hasMasterKey: true, hasLowPower: false, powerStatus: "off", occupantType: null },
    { id: 12, number: "212", status: "maintenance", hasMasterKey: true, hasLowPower: false, powerStatus: "on", occupantType: "maintenance" },
    { id: 13, number: "213", status: "vacant", hasMasterKey: true, hasLowPower: false, powerStatus: "off", occupantType: null },
    { id: 14, number: "214", status: "occupied", hasMasterKey: true, hasLowPower: false, powerStatus: "on", occupantType: "guest" },
    { id: 15, number: "215", status: "vacant", hasMasterKey: false, hasLowPower: false, powerStatus: "off", occupantType: null },
  ],
  "3": [
    { id: 1, number: "301", status: "occupied", hasMasterKey: false, hasLowPower: false, powerStatus: "on", occupantType: "guest" },
    { id: 2, number: "302", status: "vacant", hasMasterKey: true, hasLowPower: false, powerStatus: "off", occupantType: null },
    { id: 3, number: "303", status: "occupied", hasMasterKey: true, hasLowPower: false, powerStatus: "on", occupantType: "manager" },
    { id: 4, number: "304", status: "maintenance", hasMasterKey: false, hasLowPower: false, powerStatus: "on", occupantType: "maintenance" },
    { id: 5, number: "305", status: "vacant", hasMasterKey: true, hasLowPower: false, powerStatus: "off", occupantType: null },
    { id: 6, number: "306", status: "occupied", hasMasterKey: true, hasLowPower: false, powerStatus: "on", occupantType: "guest" },
    { id: 7, number: "307", status: "occupied", hasMasterKey: false, hasLowPower: false, powerStatus: "on", occupantType: "guest" },
    { id: 8, number: "308", status: "vacant", hasMasterKey: true, hasLowPower: false, powerStatus: "off", occupantType: null },
  ]
}

// Mock data for hotel cards
const mockHotelCards = [
  {
    id: "CARD001",
    roomNumber: "101",
    guestName: "Alice Johnson",
    status: "active",
    expiryDate: "2024-12-31",
    lastUsed: "2 hours ago",
  },
  {
    id: "CARD002",
    roomNumber: "102",
    guestName: "Bob Smith",
    status: "active",
    expiryDate: "2024-12-31",
    lastUsed: "1 hour ago",
  },
  {
    id: "CARD003",
    roomNumber: "103",
    guestName: "Carol Davis",
    status: "inactive",
    expiryDate: "2024-12-25",
    lastUsed: "2 days ago",
  },
]

// Mock data for hotel activity
const mockHotelActivity = [
  {
    id: "1",
    type: "checkin",
    action: "Guest checked in to Room 101",
    user: "John Smith",
    time: "2 minutes ago",
  },
  {
    id: "2",
    type: "security",
    action: "Security alert: Unauthorized access attempt",
    user: "System",
    time: "5 minutes ago",
  },
  {
    id: "3",
    type: "service",
    action: "Room service requested for Room 102",
    user: "Sarah Johnson",
    time: "10 minutes ago",
  },
  {
    id: "4",
    type: "maintenance",
    action: "Maintenance request submitted for Room 105",
    user: "Mike Wilson",
    time: "15 minutes ago",
  },
]

interface HotelDashboardProps {
  hotelId: string
  onBackToHotels: () => void
}

export function HotelDashboard({ hotelId, onBackToHotels }: HotelDashboardProps) {
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [cardSearchTerm, setCardSearchTerm] = useState("")
  const [userRoleFilter, setUserRoleFilter] = useState("all")
  const [cardStatusFilter, setCardStatusFilter] = useState("all")
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
  
  // Use live data from API
  const { hotel: hotelData, rooms: roomsData, activities, loading, error, updateHotel } = useHotelData(hotelId)

  const filteredUsers = mockHotelUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
    const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter
    return matchesSearch && matchesRole
  })

  const filteredCards = mockHotelCards.filter((card) => {
    const matchesSearch =
      card.id.toLowerCase().includes(cardSearchTerm.toLowerCase()) ||
      card.guestName.toLowerCase().includes(cardSearchTerm.toLowerCase()) ||
      card.roomNumber.toLowerCase().includes(cardSearchTerm.toLowerCase())
    const matchesStatus = cardStatusFilter === "all" || card.status === cardStatusFilter
    return matchesSearch && matchesStatus
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "checkin":
        return <UserPlus className="h-4 w-4 text-blue-500" />
      case "security":
        return <Shield className="h-4 w-4 text-red-500" />
      case "service":
        return <Activity className="h-4 w-4 text-green-500" />
      case "maintenance":
        return <Settings className="h-4 w-4 text-yellow-500" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getDynamicActivityIcon = (type: string) => {
    switch (type) {
      case "checkin":
        return <UserPlus className="h-4 w-4 text-blue-500" />
      case "checkout":
        return <User className="h-4 w-4 text-purple-500" />
      case "security":
        return <Shield className="h-4 w-4 text-red-500" />
      case "service":
        return <Bell className="h-4 w-4 text-green-500" />
      case "maintenance":
        return <Settings className="h-4 w-4 text-yellow-500" />
      case "system":
        return <Wifi className="h-4 w-4 text-cyan-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getCurrentDynamicActivity = () => {
    if (!activities || activities.length === 0) {
      return { type: "system", message: "No recent activity", time: "N/A", priority: "low" }
    }
    const activity = activities[currentActivityIndex] || activities[0]
    return {
      type: activity.type,
      message: activity.action,
      time: activity.time,
      priority: activity.type === "security" ? "high" : "normal"
    }
  }

  const getOccupantTypeIcon = (type: string | null) => {
    switch (type) {
      case "guest":
        return <User className="h-4 w-4 text-blue-600" />
      case "manager":
        return <Crown className="h-4 w-4 text-purple-600" />
      case "maintenance":
        return <Settings className="h-4 w-4 text-orange-600" />
      default:
        return null
    }
  }

  const getPowerStatusIcon = (status: string) => {
    switch (status) {
      case "on":
        return <Power className="h-4 w-4 text-green-600" />
      case "off":
        return <PowerOff className="h-4 w-4 text-gray-400" />
      case "low":
        return <BatteryWarning className="h-4 w-4 text-orange-600" />
      default:
        return <PowerOff className="h-4 w-4 text-gray-400" />
    }
  }

  // Auto-rotate activity every 5 seconds
  useEffect(() => {
    if (!activities || activities.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentActivityIndex((prev) => (prev + 1) % activities.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [activities])

  // --- AUTO-REFRESH ALL HOTELS ROOM STATUS ---
  const [allHotelRooms, setAllHotelRooms] = useState<Record<string, Room[]>>({})
  const [allHotels, setAllHotels] = useState<Hotel[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout
    const fetchAllHotelsAndRooms = async () => {
      try {
        const hotels = await apiService.getHotels()
        setAllHotels(hotels)
        const roomsByHotel: Record<string, Room[]> = {}
        await Promise.all(
          hotels.map(async (hotel) => {
            try {
              const rooms = await apiService.getRooms(hotel.id)
              roomsByHotel[hotel.id] = rooms
            } catch {}
          })
        )
        setAllHotelRooms(roomsByHotel)
      } catch {}
    }
    fetchAllHotelsAndRooms()
    interval = setInterval(fetchAllHotelsAndRooms, 5000)
    return () => clearInterval(interval)
  }, [])

  // Edit handlers
  const handleEditHotel = () => {
    setIsEditMode(true)
  }

  const handleBackFromEdit = () => {
    setIsEditMode(false)
  }

  const handleSaveHotel = async (updatedHotel: any) => {
    try {
      await updateHotel(updatedHotel)
    } catch (error) {
      console.error('Failed to update hotel:', error)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading hotel data...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <AlertTriangle className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Hotel Data</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // Show not found state
  if (!hotelData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-muted-foreground mb-4">
            <Building2 className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Hotel Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested hotel could not be found.</p>
          <Button onClick={onBackToHotels}>
            Back to Hotels
          </Button>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-4">
            {/* Hotel Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Rooms</p>
                      <p className="text-xl font-bold text-blue-800 dark:text-blue-200">{hotelData.totalRooms}</p>
                    </div>
                    <div className="p-2 bg-blue-200/50 dark:bg-blue-800/30 rounded-lg">
                      <Building2 className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">Active Rooms</p>
                      <p className="text-xl font-bold text-green-800 dark:text-green-200">{hotelData.activeRooms || 0}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {Math.round(((hotelData.activeRooms || 0) / (hotelData.totalRooms || 1)) * 100)}% occupancy
                      </p>
                    </div>
                    <div className="p-2 bg-green-200/50 dark:bg-green-800/30 rounded-lg">
                      <Building2 className="h-4 w-4 text-green-700 dark:text-green-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Manager</p>
                      <p className="text-base font-bold text-purple-800 dark:text-purple-200">{hotelData.manager?.name}</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">{hotelData.manager?.phone}</p>
                    </div>
                    <div className="p-2 bg-purple-200/50 dark:bg-purple-800/30 rounded-lg">
                      <User className="h-4 w-4 text-purple-700 dark:text-purple-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Live Activity</p>
                      <p className="text-sm font-bold text-orange-800 dark:text-orange-200 truncate">
                        {getCurrentDynamicActivity()?.message}
                      </p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {getCurrentDynamicActivity()?.time}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-200/50 dark:bg-orange-800/30 rounded-lg ml-2">
                      {getDynamicActivityIcon(getCurrentDynamicActivity()?.type || "default")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

                        {/* Room Status Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Occupied</p>
                  <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                    {roomsData?.filter(room => room.status === "occupied").length || 0}
                  </p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">Vacant</p>
                  <p className="text-2xl font-bold text-red-800 dark:text-red-200">
                    {roomsData?.filter(room => room.status === "vacant").length || 0}
                  </p>
                </div>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Master Keys</p>
                  <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    {roomsData?.filter(room => room.hasMasterKey).length || 0}
                  </p>
                </div>
                <Crown className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Maintenance</p>
                  <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                    {roomsData?.filter(room => room.status === "maintenance").length || 0}
                  </p>
                </div>
                <Settings className="h-5 w-5 text-purple-600" />
              </div>
            </div>

            {/* Room Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Room Status Overview</CardTitle>
                  <CardDescription className="text-xs">Individual room status and occupancy</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {roomsData?.map((room) => {
                      const getStatusColor = () => {
                        if (room.status === "maintenance") return "bg-purple-500"
                        if (room.status === "occupied") return "bg-green-500"
                        return "bg-red-500"
                      }

                      return (
                        <div
                          key={`${hotelId}-${room.number}`}
                          className={`relative p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 cursor-pointer min-h-[100px] ${
                            room.status === "maintenance"
                              ? "bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700"
                              : room.status === "occupied"
                              ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                              : "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
                          }`}
                        >
                          {/* Room Number */}
                          <div className="text-center mb-3">
                            <span className="text-base font-bold text-gray-900 dark:text-white">
                              Room {room.number}
                            </span>
                          </div>
                          
                          {/* Status Indicators */}
                          <div className="flex items-center justify-center space-x-2 mb-3">
                            {room.occupantType && getOccupantTypeIcon(room.occupantType)}
                            {getPowerStatusIcon(room.powerStatus)}
                            {room.hasMasterKey && (
                              <Crown className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                          
                          {/* Status Dot */}
                          <div className={`absolute top-3 right-3 w-3 h-3 ${getStatusColor()} rounded-full`}></div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Status Legend</CardTitle>
                  <CardDescription className="text-xs">Room status indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Occupied</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium">Vacant</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium">Maintenance</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-xs font-medium mb-2">Occupant Types</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-3 w-3 text-blue-600" />
                        <span className="text-xs">Guest</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Crown className="h-3 w-3 text-purple-600" />
                        <span className="text-xs">Manager</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Settings className="h-3 w-3 text-orange-600" />
                        <span className="text-xs">Maintenance</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-xs font-medium mb-2">Power Status</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Power className="h-3 w-3 text-green-600" />
                        <span className="text-xs">Power On</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <PowerOff className="h-3 w-3 text-gray-500" />
                        <span className="text-xs">Power Off</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-xs font-medium mb-2">Other Icons</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Crown className="h-3 w-3 text-yellow-600" />
                        <span className="text-xs">Master Key</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-muted-foreground">Total Rooms</span>
                      <span className="text-xs font-medium">{hotelData.totalRooms}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${hotelData.occupancy}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Occupancy Rate: {hotelData.occupancy}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              <ModernCard variant="glass">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-primary-light/20 rounded-lg flex-shrink-0">
                        <Phone className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-xs font-medium truncate">{hotelData.phone}</span>
                    </div>
                  </CardContent>
                </ModernCard>
                <ModernCard variant="glass">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-accent-light/20 rounded-lg flex-shrink-0">
                        <Mail className="h-3 w-3 text-accent" />
                      </div>
                      <span className="text-xs font-medium truncate">{hotelData.email}</span>
                    </div>
                  </CardContent>
                </ModernCard>
                <ModernCard variant="glass" className="sm:col-span-2 lg:col-span-1">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-secondary-light/20 rounded-lg flex-shrink-0">
                        <MapPin className="h-3 w-3 text-secondary" />
                      </div>
                      <span className="text-xs font-medium truncate">{hotelData.address}</span>
                    </div>
                  </CardContent>
                </ModernCard>
            </div>
          </div>
        )

      case "analytics":
        return (
          <div className="h-[calc(100vh-200px)] min-h-[600px]">
            <HotelAnalytics hotelId={hotelId} />
          </div>
        )

      case "rooms":
        return <RoomManagement hotelId={hotelId} />

      case "staff":
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Staff Management</CardTitle>
                  <CardDescription>Manage hotel staff and their permissions</CardDescription>
                </div>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Staff
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search staff..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )

      case "cards":
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Key Card Management</CardTitle>
                  <CardDescription>Manage hotel key cards and access control</CardDescription>
                </div>
                <Button>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Issue New Card
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search cards..."
                    value={cardSearchTerm}
                    onChange={(e) => setCardSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={cardStatusFilter} onValueChange={setCardStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Card ID</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCards.map((card) => (
                      <TableRow key={card.id}>
                        <TableCell className="font-mono">{card.id}</TableCell>
                        <TableCell>{card.roomNumber}</TableCell>
                        <TableCell>{card.guestName}</TableCell>
                        <TableCell>
                          <Badge variant={card.status === "active" ? "default" : "secondary"}>
                            {card.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{card.expiryDate}</TableCell>
                        <TableCell>{card.lastUsed}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              {card.status === "active" ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )

      case "activity":
        // Remove duplicates by action, user, and time
        const uniqueActivities = activities
          ? activities.filter(
              (a, idx, arr) =>
                arr.findIndex(
                  (b) =>
                    b.action === a.action &&
                    b.user === a.user &&
                    b.time === a.time
                ) === idx
            )
          : []

        return (
          <Card>
            <CardHeader>
              <CardTitle>Hotel Activity Log</CardTitle>
              <CardDescription>Detailed activity history for this hotel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uniqueActivities.length > 0 ? (
                  uniqueActivities.map((activity, idx) => (
                    <div key={`${activity.action}-${activity.user}-${activity.time}-${idx}`} className="flex items-start space-x-3 p-4 rounded-lg border">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{activity.action}</h4>
                        <p className="text-sm text-muted-foreground">by {activity.user}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No activity recorded yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )

      case "calendar":
        return <HotelCalendar hotelId={hotelId} hotelName={hotelData.name} />

      default:
        return <div>Section not found</div>
    }
  }

  // Show edit page if in edit mode
  if (isEditMode) {
    return (
      <HotelEditPage
        hotel={hotelData}
        onBack={handleBackFromEdit}
        onSave={handleSaveHotel}
      />
    )
  }

  return (
            <div className="fixed inset-0 flex bg-background overflow-hidden">
      {/* Sidebar */}
      <HotelDetailsSidebar
        hotel={hotelData}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onBackToHotels={onBackToHotels}
        isOpen={sidebarOpen}
        onOpenChange={setSidebarOpen}
        onEditHotel={handleEditHotel}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Content Area */}
        <div className="flex-1 overflow-hidden p-4 sm:p-5 lg:p-6 xl:p-8">
          <div className="h-full flex flex-col">
            {/* Mobile Header - Material Design */}
            <div className="lg:hidden flex items-center justify-between mb-6 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    {/* Material Design Typography - Headline Small */}
                    <h1 className="text-lg font-medium text-gray-900 dark:text-white leading-6 tracking-tight">
                      {hotelData.name}
                    </h1>
                    {/* Material Design Typography - Body Small */}
                    <div className="flex items-center space-x-1 mt-0.5">
                      <div className="p-0.5 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                        <MapPin className="h-2.5 w-2.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-5 font-normal">
                        {hotelData.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEditHotel}
                  className="h-10 w-10 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-full">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{hotelData.rating}</span>
                </div>
              </div>
            </div>

            {/* Desktop Header - Material Design */}
            <div className="hidden lg:flex items-center justify-between mb-6 flex-shrink-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  {/* Material Design Typography - Headline Medium */}
                  <h1 className="text-2xl font-medium text-gray-900 dark:text-white leading-8 tracking-tight mb-1">
                    {hotelData.name}
                  </h1>
                  {/* Material Design Typography - Body Medium */}
                  <div className="flex items-center space-x-2">
                    <div className="p-1 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                      <MapPin className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-base text-gray-600 dark:text-gray-300 leading-6 font-normal">
                      {hotelData.location}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-full">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-base font-semibold text-gray-900 dark:text-white">{hotelData.rating}</span>
                </div>
                <Badge variant="success" className="text-sm px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                  <CheckCircle className="h-3 w-3 mr-1.5" />
                  Operational
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditHotel}
                  className="h-10 px-4 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 rounded-lg font-medium"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Hotel
                </Button>
              </div>
            </div>

            {/* Section Content */}
            <div className="flex-1 overflow-y-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}