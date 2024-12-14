import Coordinate from "../Model/Coordinates.jsx";

class CommonFunctionService {
    circleLineIntersection(firstPont, nextPoint, centre, radius) {
        // calculate the slop
        let m = (nextPoint.y - firstPont.y) / (nextPoint.x - firstPont.x)
        // calculate the intercept
        let b = firstPont.y - m * firstPont.x


        const A = 1 + m * m;
        const B = 2 * (m * b - m * centre.y - centre.x);
        const C = centre.x * centre.x + centre.y * centre.y + b * b - 2 * b * centre.y - radius * radius;

        // Calculate the discriminant
        const discriminant = B * B - 4 * A * C; //(b2-4ac)

        if (discriminant < 0) {
            // No intersection
            return [];
        } else {
            // Two intersections
            const sqrtDiscriminant = Math.sqrt(discriminant);

            const x1 = (-B + sqrtDiscriminant) / (2 * A);
            const y1 = m * x1 + b;

            const x2 = (-B - sqrtDiscriminant) / (2 * A);
            const y2 = m * x2 + b;

            return [
                new Coordinate(x1, y1),
                new Coordinate(x2, y2),
            ];
        }

    }
     boundingBoxIntersect(p1, p2, cx, cy, r) {
        const minX = Math.min(p1.x, p2.x);
        const maxX = Math.max(p1.x, p2.x);
        const minY = Math.min(p1.y, p2.y);
        const maxY = Math.max(p1.y, p2.y);

        return (
            minX <= cx + r && maxX >= cx - r &&
            minY <= cy + r && maxY >= cy - r
        );
    }

     isPointOnSegment(p1, p2, p) {
        const minX = Math.min(p1.x, p2.x);
        const maxX = Math.max(p1.x, p2.x);
        const minY = Math.min(p1.y, p2.y);
        const maxY = Math.max(p1.y, p2.y);
        return p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY;
    }

    findRole(roles,roleName) {
        console.log(roles)
        return roles.find(role => role.authority === roleName);
    }


    getRandomTwoColorsForPieChart() {
        const colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];

        if (colorList.length < 2) {
            throw new Error("The color list must contain at least two colors.");
        }

        // Pick the first random index
        const firstIndex = Math.floor(Math.random() * colorList.length);

        // Ensure the second index is different from the first
        let secondIndex;
        do {
            secondIndex = Math.floor(Math.random() * colorList.length);
        } while (secondIndex === firstIndex);

        return [colorList[firstIndex], colorList[secondIndex]];
    }
}

const commonFunctionService = new CommonFunctionService()
export default commonFunctionService