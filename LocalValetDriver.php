<?php

/**
 * JavaScript SPA Local Valet Driver
 */
class LocalValetDriver extends ValetDriver
{
    /**
     * Serves
     * Determine if the driver serves the request by checking for an
     * `index.html` file within the `/public/` directory.
     *
     * @param string $sitePath
     * @param string $siteName
     * @param string $uri
     *
     * @return  bool
     */
    public function serves($sitePath, $siteName, $uri)
    {
        if (file_exists($sitePath . '/index.html')) {
            return true;
        }

        return false;
    }

    /**
     * isStaticFile
     * Determine if the incoming request is for a static file.
     *
     * @param string $sitePath
     * @param string $siteName
     * @param string $uri
     *
     * @return  string|false
     */
    public function isStaticFile($sitePath, $siteName, $uri)
    {
        $staticFilePath = $sitePath . '/' . $uri;
        if (file_exists($staticFilePath) && !is_dir($staticFilePath)) {
            return $staticFilePath;
        }

        return false;
    }

    /**
     * frontControllerPath
     * Get the fully resolved path to the application's front controller.
     *
     * @param string $sitePath
     * @param string $siteName
     * @param string $uri
     *
     * @return  string
     */
    public function frontControllerPath($sitePath, $siteName, $uri)
    {
        return $sitePath . '/index.html';
    }
}
