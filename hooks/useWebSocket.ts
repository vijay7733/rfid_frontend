import { useEffect } from 'react';
import { socketService } from '@/lib/socket';

/**
 * useWebSocket hook for hotel dashboard real-time updates
 * @param hotelId Hotel ID
 * @param onRoomUpdate Callback for room updates
 * @param onActivityUpdate Callback for activity updates
 */
export function useWebSocket(
  hotelId: string,
  onRoomUpdate?: (data: any) => void,
  onActivityUpdate?: (data: any) => void
) {
  useEffect(() => {
    if (!hotelId) return;
    if (onRoomUpdate) {
      socketService.onRoomUpdate(hotelId, onRoomUpdate);
    }
    if (onActivityUpdate) {
      socketService.onActivityUpdate(hotelId, onActivityUpdate);
    }
    // Cleanup
    return () => {
      if (onRoomUpdate) {
        socketService.offRoomUpdate(hotelId, onRoomUpdate);
      }
      if (onActivityUpdate) {
        socketService.offActivityUpdate(hotelId, onActivityUpdate);
      }
    };
  }, [hotelId, onRoomUpdate, onActivityUpdate]);
}
