import cv2
print(cv2.__file__)
import numpy as np
import cv2
import math

roiPts = []
track_mode = False
termination = (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 10, 1)
roiBox = None

def selectROI(event, x, y, flags, param):
    global track_mode, roiPts
    if (event == cv2.EVENT_LBUTTONDOWN) and (len(roiPts) == 4):
        roiPts = []
        track_mode = False
    if (event == cv2.EVENT_LBUTTONDOWN) and (len(roiPts) < 4):
        roiPts.append([x, y])

cam = 0
cap = cv2.VideoCapture(cam)
cv2.namedWindow("frame")
cv2.setMouseCallback("frame", selectROI)

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    frame = cv2.boxFilter(frame, 0, (5, 5), normalize=True)
    
    if len(roiPts) <= 4 and len(roiPts) > 0:
        for x, y in roiPts:
            cv2.circle(frame, (x, y), 4, (0, 255, 0), 1)

    if len(roiPts) == 4 and track_mode == False:
        roiBox = np.array(roiPts, dtype=np.int32)
        s = roiBox.sum(axis=1)
        tl = roiBox[np.argmin(s)]
        br = roiBox[np.argmax(s)]
        roi = frame[tl[1]:br[1], tl[0]:br[0]]

        hsv_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
        roiHist = cv2.calcHist([hsv_roi], [0, 1], None, [16, 16], [0, 180, 0, 256])
        roiHist = cv2.normalize(roiHist, roiHist, 0, 255, cv2.NORM_MINMAX)
        
        roiBox = (tl[0], tl[1], br[0] - tl[0], br[1] - tl[1])
        track_mode = True

    if track_mode:
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        backProj = cv2.calcBackProject([hsv], [0, 1], roiHist, [0, 180, 0, 256], 1)
        
        # Amélioration morphologique
        disc = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        backProj = cv2.morphologyEx(backProj, cv2.MORPH_OPEN, disc)
        backProj = cv2.morphologyEx(backProj, cv2.MORPH_CLOSE, disc)
        
        # Application de CamShift
        ret, roiBox = cv2.CamShift(backProj, roiBox, termination)
        
        # Calcul des moments pour tracer les axes
        moments = cv2.moments(backProj)
        if moments['m00'] != 0:
            # Centre de masse
            xc = int(moments['m10']/moments['m00'])
            yc = int(moments['m01']/moments['m00'])
            
            # Calcul de l'orientation
            a = moments['m20']/moments['m00'] - xc**2
            b = 2*(moments['m11']/moments['m00'] - xc*yc)
            c = moments['m02']/moments['m00'] - yc**2
            
            # Angle de rotation
            if (a - c) == 0:
                theta = math.pi/2
            else:
                theta = 0.5*math.atan(b/(a-c))
            
            # Longueur des axes
            d = math.sqrt(b*2 + (a-c)*2)
            l = math.sqrt((a+c + d)/2) * 2
            w = math.sqrt((a+c - d)/2) * 2
            
            # Tracé des axes
            cos_theta = math.cos(theta)
            sin_theta = math.sin(theta)
            
            # Axe principal (en jaune)
            cv2.line(frame, 
                    (int(xc - cos_theta*w), int(yc - sin_theta*w)),
                    (int(xc + cos_theta*w), int(yc + sin_theta*w)),
                    (0, 255, 255), 2)
            
            # Axe secondaire (en jaune)
            cv2.line(frame,
                    (int(xc + sin_theta*l), int(yc - cos_theta*l)),
                    (int(xc - sin_theta*l), int(yc + cos_theta*l)),
                    (0, 255, 255), 2)
        
        # Tracé de la boîte rotative
        pts = cv2.boxPoints(ret)
        pts = np.int32(pts)
        cv2.polylines(frame, [pts], True, (0, 255, 0), 2)
        
        cv2.imshow("Backprojection", backProj)

    cv2.imshow("frame", frame)
    
    key = cv2.waitKey(1)
    if key == 27:
        break

cap.release()
cv2.destroyAllWindows()