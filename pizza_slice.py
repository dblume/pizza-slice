#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import print_function
import time
from argparse import ArgumentParser
import math

__author__ = 'David Blume'


def halve_slice(tip_angle, radius):
    """ Given the last pizza slice, tip down, divide it in half with
    a horizontal cut with the crust at the top, such that each half
    has the same total area.
       ____
    _--    --_
    \        /
     \------/
      \    /
       \  /
        \/
    :param tip_angle:
    :param radius:
    :return:
    """
    # area_of_slice = (math.pi * radius * radius) * (tip_angle / (2 * math.pi))
    area_of_half_slice = radius * radius * tip_angle / 4.0
    # area_of_half_slice = area_of_pizza / num_slices / 2.0
    # tip_angle = math.pi * 2 / num_slices  # in radians

    # Now we divide the triangular slice into two smaller right triangles.
    #
    # a = angle of right triangle at tip
    # h = hypotenuse (a fraction of the radius)
    # w = width of triangle
    # l = length of triangle
    # (l * w) / 2 = area of right triangle
    # (l * w) / 2 * 2 = area of half slice
    #
    #            w
    #   \-----|-----/
    #    \    |90  /
    #     \  l|   /
    #      \  |  / h
    #       \ |a/
    #        \|/
    #         v
    # area_of_half_slice =    l    *     w
    # area_of_half_slice = cos(a)h * sin(a)h
    # area_of_half_slice = (h * h)(cos(a) * sin(a))
    # area_of_half_slice / (cos(a) * sin(a)) = h * h
    a = tip_angle / 2.0
    h = math.sqrt(area_of_half_slice/(math.cos(a)*math.sin(a)))
    l = h * math.cos(a)
    return h, l


def calc_area_for_big_angle(angle, fraction_in_triangles, radius):
    """ Calculate the area for wide slices where fraction_in_triangles of angle
    is used in the triangles.

          /\-----------|-----------/\
         /   \         |90       /   \
        |      \      l|       /      |
        |      r \     |     / r      |
         ---.__    \   |a  /    __.---
            rx --.__ \ | /b__.-- ry     "angle" is angle from line segments rx to ry.
                    --.v.--

    If theta is minimum, 1.8956, then fraction_in_triangles will be around 0.9999655 for a good match
    If theta is maximum, pi, then fraction_in_trangles will be around 0.7352581 for a good match
    """
    angle_in_rect = angle * fraction_in_triangles
    a = angle_in_rect / 2.0  # angle in each triangle part
    area_of_rectangle_part = math.cos(a) * math.sin(a) * radius * radius
    angle_in_sector = angle - angle_in_rect
    area_of_sector_parts = radius * radius * angle_in_sector / 2.0
    return area_of_rectangle_part + area_of_sector_parts


def halve_slice_big_angle(angle, radius):
    """ angle must be > 1.8956 (where length is 0.5835 * radius) and < 3.1416 """
    assert(1.8956 <= angle <= math.pi)
    area_of_half_slice = radius * radius * angle / 4.0

    # if angle = 1.8956, fraction_in_triangles = 0.9999655
    # if angle = 3.1416, fraction_in_trangles = 0.7352581

    count = 0
    min_angle = 1.8956
    min_angle_trifract = 0.9999655
    max_angle = math.pi
    max_angle_trifract = 0.7352581
    fraction_in_triangles = min_angle_trifract - ((angle - min_angle) / (max_angle - min_angle) * (min_angle_trifract - max_angle_trifract))
    done = False

    while not done:
        area = calc_area_for_big_angle(angle, fraction_in_triangles, radius)
        diff_pct = (area_of_half_slice - area) / area_of_half_slice
        print("Loop %d: angle %1.2f, tried fraction %1.6f and got difference of %1.3f - %1.3f = %1.2f%%" % (count, angle, fraction_in_triangles, area_of_half_slice, area, diff_pct * 100))
        height_of_line = math.cos((angle * fraction_in_triangles) / 2) * radius  # l
        if abs(diff_pct) < 0.0005:
            print("Close enough! We're done.");
            done = True
            break
        if area_of_half_slice > area:
            # Need to increase area. So decrease the percentage that goes to triangles.
            # Drive fraction_in_triangles closer to the low value in max_angle_trifract.
            min_angle_trifract = fraction_in_triangles
        else:
            # Need to decrease the area. So increase the percentage that goes to triangles.
            # Drive fraction_in_triangles closer to the high value in min_angle_trifract.
            max_angle_trifract = fraction_in_triangles
        fraction_in_triangles = min_angle_trifract - ( min_angle_trifract - max_angle_trifract ) * 0.5
        # Set fraction_in_triangles proportionally to where angle
        # sits between last_angle_min an
        count += 1
        if count > 10:
            print("Ran too many loops. Exiting.")
            break
    return height_of_line


def frange(start, stop, step):
    """ returns a generator expression """
    return (x * step for x in range(int(start / step), int(stop / step)))


def main(debug):
    start_time = time.time()
    # for i in range(1, 110):
#    for i in frange(90, 110, 0.01):
#        h, l = halve_slice(math.radians(i), 1)
#        print("angle = %1.1f (%1.4f radians): hypotenuse=%1.4f length= %1.4f" % (i, math.radians(i), h, l))

    print("Line height for %1.4f is %1.4fin" % (1.8956, halve_slice_big_angle(1.8956, 1.0)));
    print("Line height for %1.4f is %1.4fin" % (2.0, halve_slice_big_angle(2.0, 1.0)));
    print("Line height for %1.4f is %1.4fin" % ((1.8956 + math.pi)/2, halve_slice_big_angle((1.8956 + math.pi)/2, 1.0)));
    print("Line height for %1.4f is %1.4fin" % (3.0, halve_slice_big_angle(3.0, 1.0)));
    print("Line height for %1.4f is %1.4fin" % (math.pi, halve_slice_big_angle(math.pi, 1.0)));

    print("Done.  That took %1.2fs." % (time.time() - start_time))


if __name__ == '__main__':
    parser = ArgumentParser(description='Just a sample script.')
    parser.add_argument('-d', '--debug', action='store_true')
    args = parser.parse_args()
    main(args.debug)
