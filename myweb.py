import numpy as np
import matplotlib.pyplot as plt
from scipy.special import sph_harm
from scipy.special import assoc_laguerre

import eel

eel.init('web')


# @eel.expose
def make_materx(n, l, m):
    n, l, m = float(n), float(l), float(m)
    # x = np.linspace(-n ** 2 * 4, n ** 2 * 4, 500)
    # y = 0  #### the plane locates at y = 0
    # z = np.linspace(-n ** 2 * 4, n ** 2 * 4, 500)
    # X, Z = np.meshgrid(x, z)
    # rho = np.linalg.norm((X, y, Z), axis=0) / n
    # Lag = assoc_laguerre(2 * rho, n - l - 1, 2 * l + 1)
    # Ylm = sph_harm(m, l, np.arctan2(y, X), np.arctan2(np.linalg.norm((X, y), axis=0), Z))
    # Psi = np.exp(-rho) * np.power((2 * rho), l) * Lag * Ylm
    #
    # density = np.conjugate(Psi) * Psi
    # density = density.real
    # fig, ax = plt.subplots(figsize=(10, 10))
    # ax.imshow(density.real,
    #           extent=[-density.max() * 0.2, density.max() * 0.2, -density.max() * 0.2, density.max() * 0.2])
    # # plt.show()
    # fig.savefig("web/assets/images/a.png", dpi=300)
    # plt.close()

    theta1 = np.linspace(0, 2 * np.pi, 181)
    phi1 = np.linspace(0, np.pi, 91)
    theta_2d, phi_2d = np.meshgrid(theta1, phi1)
    Ylm1 = sph_harm(abs(m), l, theta_2d, phi_2d)
    xyz_2d = np.array([np.sin(phi_2d) * np.sin(theta_2d), np.sin(phi_2d) * np.cos(theta_2d), np.cos(phi_2d)])
    if m < 0:
        Ylm1 = np.sqrt(2) * (-1) ** m * Ylm1.imag
    else:
        Ylm1 = np.sqrt(2) * (-1) ** m * Ylm1.real
    r = np.abs(Ylm1.real) * xyz_2d

    R = {"r0": 1e-15}
    F = {"f0": 0.0}
    G = {"g0": 0.0}
    nn = 0

    s = 1
    m = 360
    E = -0.03125

    F["f1"] = 0.0001
    R["r1"] = R["r0"] + s
    G["g0"] = l * (l + 1) / (R["r0"] ** 2) - 2 / R["r0"] - 2 * E
    G["g1"] = l * (l + 1) / (R["r1"] ** 2) - 2 / R["r1"] - 2 * E
    ss = s * s / 12

    for i in range(1, m + 1):
        R["r%s" % (i + 1)] = R["r%s" % i] + s
        G["g%s" % (i + 1)] = l * (l + 1) / (R["r%s" % (i + 1)] ** 2) - 2 / R["r%s" % (i + 1)] - 2 * E
        F["f%s" % (i + 1)] = (-F["f%s" % (i - 1)] + 2 * F["f%s" % i] + 10 * G["g%s" % i] * F["f%s" \
                                                                                             % i] * ss + G[
                                  "g%s" % (i - 1)] * F["f%s" % (i - 1)] * ss) / (1 - G["g%s" % (i + 1)] * ss)
        if (F["f%s" % i] * F["f%s" % (i + 1)] < 0):
            nn = nn + 1
    x = []
    for i in range(m + 1):
        x.append([R["r%s" % i], F["f%s" % i] / R["r%s" % i]])
    plt.plot([i[0] for i in x], [i[1] for i in x])
    plt.show()
    # console('./assets/images/a.png', r)


# def console(src, r):
#     eel.result(src, r.tolist())


# eel.start('index.html')

make_materx(4, 2, 2)
