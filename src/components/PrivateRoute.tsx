import { Route, Navigate, RouteProps } from "react-router-dom"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"

interface PrivateRouteProps extends Omit<RouteProps, "element"> {
  element: React.ReactElement
}

function PrivateRoute({ element, ...rest }: PrivateRouteProps) {
  const user = firebase.auth().currentUser

  return user ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to="/Login" replace />
  )
}

export default PrivateRoute
