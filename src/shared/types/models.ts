export type User = { id: string; email: string; role?: "ADMIN" | "USER" }

export type Concert = {
  id: string
  name: string
  description?: string
  seats: number
  createdAt?: string
  updatedAt?: string
}

export type Reservation = {
  id: string
  concertId: string
  userId: string
  createdAt: string
}
